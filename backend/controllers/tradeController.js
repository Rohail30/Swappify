const Trade = require('../models/tradeModel');
const Item = require('../models/ItemModel');
const User = require('../models/UserModel');
const sendMail = require('../config/nodemailer');

// @desc    Offer new trade
// @route   POST /api/trades
// @access  Private

const offerTrade = async (req, res) => {
  const { fromUser, toUser, ItemOffered, ItemWanted } = req.body;

  if (!fromUser || !toUser || !ItemOffered || !ItemWanted) {
    return res.status(400).json({ error: true, message: 'Please enter all the required fields' });
  }

  const usersExist = await User.find({ _id: { $in: [fromUser, toUser] } });

  if (usersExist.length !== 2) {
    return res.status(400).json({ error: true, message: 'One or more users do not exist' });
  }

  const itemsExist = await Item.find({ _id: { $in: [ItemOffered, ItemWanted] } });

  if (itemsExist.length !== 2) {
    return res.status(400).json({ error: true, message: 'One or more items do not exist' });
  }

  const itemOwnership = await Item.find({
    $or: [
      { _id: ItemOffered, owner: fromUser },
      { _id: ItemWanted, owner: toUser }
    ]
  });

  if (itemOwnership.length !== 2) {
    return res.status(400).json({ error: true, message: 'One or more items do not belong to the respective users' });
  }

  const itemStatus = await Item.find({ _id: { $in: [ItemOffered, ItemWanted] }, status: 'traded' });

  if (itemStatus.length > 0) {
    return res.status(400).json({ error: true, message: 'One or more items are already traded' });
  }

  const ItemWantedArray = [].concat(ItemWanted);

  const tradeExists = await Trade.find({
    fromUser,
    toUser,
    ItemOffered,
    ItemWanted: { $all: ItemWantedArray },
    status: 'pending',
  });

  if (tradeExists.some(x => x.ItemWanted.length === ItemWantedArray.length)) {
    return res.status(400).json({ error: true, message: 'Trade already exists' });
  }

  const reverseTradeExists = await Trade.find({ fromUser: toUser, toUser: fromUser, ItemOffered: ItemWanted, ItemWanted: ItemOffered, status: 'pending' });

  if (reverseTradeExists.length > 0) {
    return res.status(400).json({ error: true, message: 'Same trade already offered by the other user' });
  }

  try {
    const newTrade = await Trade.create({ fromUser, toUser, ItemOffered, ItemWanted });

    const data = {
      email: usersExist[1].email,
      itemName: itemsExist[1].name
    };

    sendMail('receiveTradeOffer', data);

    return res.status(200).json({ error: false, message: 'Trade offered successfully', trade: newTrade });

  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

// @desc    Get all trades
// @route   GET /api/trades
// @access  Private

const getTrades = async (req, res) => {
  const userId = req.userId;

  try {
    const trades = await Trade.find({
      $or: [{ fromUser: userId }, { toUser: userId }],
    })
      .populate('fromUser', 'name')
      .populate('toUser', 'name')
      .populate('ItemOffered')
      .populate('ItemWanted')
      .populate("counteredFrom")
      .sort({ isCounterTrade: 1, createdAt: 1 })

    return res.status(200).json({ error: false, trades });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};


// @desc   Get trade by ID
// @route  GET /api/trades/:id
// @access Private

const getTradeById = async (req, res) => {
  const tradeId = req.params.id;

  if (!tradeId) {
    return res.status(400).json({ error: true, message: 'Trade ID is required' });
  }

  try {
    const trade = await Trade.findById(tradeId)
      .populate('ItemOffered')
      .populate('ItemWanted')
      .populate('fromUser', 'name')
      .populate('toUser', 'name');

    if (!trade) {
      return res.status(404).json({ error: true, message: 'Trade not found' });
    }

    return res.status(200).json({ error: false, trade });

  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};


// @desc    Accept trade
// @route   PUT /api/trades/:id/accept
// @access  Private

const acceptTrade = async (req, res) => {
  const userId = req.userId;
  const tradeId = req.params.id;

  if (!tradeId) {
    return res.status(400).json({ error: true, message: "Trade ID is required" });
  }

  try {
    const trade = await Trade.findById(tradeId)
      .populate('fromUser', 'email')
      .populate('ItemOffered', 'name');

    if (!trade) {
      return res.status(404).json({ error: true, message: "Trade not found" });
    }

    if (trade.toUser.toString() !== userId) {
      return res.status(401).json({ error: true, message: "Not authorized to accept this trade" });
    }

    if (trade.status !== "pending") {
      return res.status(400).json({ error: true, message: "Trade is not pending" });
    }

    await Trade.findByIdAndUpdate(tradeId, { status: "accepted" });

    await Item.findByIdAndUpdate(trade.ItemOffered, { status: "traded" });

    await Item.updateMany({ _id: { $in: trade.ItemWanted } }, { status: "traded" });

    await Trade.updateMany(
      {
        $or: [
          { ItemOffered: trade.ItemOffered, status: "pending" },
          { ItemWanted: { $in: trade.ItemWanted }, status: "pending" },
          { ItemOffered: { $in: trade.ItemWanted }, status: "pending" },
          { ItemWanted: trade.ItemOffered, status: "pending" },
        ],
      },
      { status: "cancelled" }
    );

    const data = {
      email: trade.fromUser.email,
      itemName: trade.ItemOffered.name
    };

    sendMail('tradeOfferAccepted', data);

    return res.status(200).json({ error: false, message: "Trade accepted successfully" });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

// @desc    Reject trade
// @route   PUT /api/trades/:id/reject
// @access  Private

const rejectTrade = async (req, res) => {
  const userId = req.userId;
  const tradeId = req.params.id;

  if (!tradeId) {
    return res.status(400).json({ error: true, message: 'Trade ID is required' });
  }

  try {
    const trade = await Trade.findById(tradeId);

    if (!trade) {
      return res.status(404).json({ error: true, message: 'Trade not found' });
    }

    if (trade.toUser != userId) {
      return res.status(401).json({ error: true, message: 'Not authorized to reject this trade' });
    }

    if (trade.status !== 'pending') {
      return res.status(400).json({ error: true, message: 'Trade is not pending' });
    }

    await Trade.findByIdAndUpdate(tradeId, { status: 'rejected' });

    return res.status(200).json({ error: false, message: 'Trade rejected successfully' });

  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

// @desc    Cancel trade
// @route   PUT /api/trades/:id/cancel
// @access  Private

const cancelTrade = async (req, res) => {
  const userId = req.userId;
  const tradeId = req.params.id;

  if (!tradeId) {
    return res.status(400).json({ error: true, message: 'Trade ID is required' });
  }

  try {
    const trade = await Trade.findById(tradeId);

    if (!trade) {
      return res.status(404).json({ error: true, message: 'Trade not found' });
    }

    if (trade.fromUser != userId) {
      return res.status(401).json({ error: true, message: 'Not authorized to cancel this trade' });
    }

    if (trade.status !== 'pending') {
      return res.status(400).json({ error: true, message: 'Trade is not pending' });
    }

    await Trade.findByIdAndUpdate(tradeId, { status: 'cancelled' });

    return res.status(200).json({ error: false, message: 'Trade cancelled successfully' });

  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

// @desc    Counter a trade offer
// @route   POST /api/trades/:id/counter
// @access  Private

const counterTrade = async (req, res) => {
  const userId = req.userId;
  const tradeId = req.params.id;
  const { ItemOffered, ItemWanted } = req.body;

  if (!tradeId || !ItemOffered || !ItemWanted || ItemWanted.length === 0) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  try {
    const trade = await Trade.findById(tradeId)
      .populate('fromUser', 'email')
      .populate('ItemOffered', 'name');

    if (!trade) {
      return res.status(404).json({ error: true, message: "Trade not found" });
    }

    if (trade.status !== "pending") {
      return res.status(400).json({ error: true, message: "Trade is not pending" });
    }

    if (trade.toUser.toString() !== userId) {
      return res.status(401).json({ error: true, message: "Not authorized to counter this trade" });
    }

    if (ItemWanted.length === 1 && trade.ItemOffered._id.toString() === ItemWanted[0]) {
      return res.status(400).json({ error: true, message: "Single item trade cannot be countered with the same item" });
    }

    const itemOwnership = await Item.find({
      $or: [
        { _id: ItemOffered, owner: trade.toUser },
        { _id: { $in: ItemWanted }, owner: trade.fromUser }
      ]
    });

    if (itemOwnership.length !== ItemWanted.length + 1) {
      return res.status(400).json({ error: true, message: "One or more items do not belong to the respective users" });
    }

    const itemStatus = await Item.find({ _id: { $in: [ItemOffered, ...ItemWanted] }, status: "traded" });

    if (itemStatus.length > 0) {
      return res.status(400).json({ error: true, message: "One or more items are already traded" });
    }

    if (ItemWanted.length === 1) {

      const existingTrade = await Trade.findOne({
        fromUser: userId,
        toUser: trade.fromUser,
        ItemOffered,
        ItemWanted: { $all: ItemWanted },
        status: "pending",
      });

      if (existingTrade) {
        return res.status(400).json({ error: true, message: "Trade already exists" });
      }
    }

    const counterTrade = await Trade.create({
      fromUser: userId,
      toUser: trade.fromUser,
      ItemOffered,
      ItemWanted,
      isCounterTrade: true,
      counteredFrom: tradeId
    });

    await Trade.findByIdAndUpdate(tradeId, { status: "cancelled" });

    const data = {
      email: trade.fromUser.email,
      itemName: trade.ItemOffered.name
    };

    sendMail('counterTradeOffer', data);

    return res.status(200).json({ error: false, message: "Counter trade sent successfully", trade: counterTrade });

  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = { offerTrade, getTrades, acceptTrade, rejectTrade, cancelTrade, counterTrade, getTradeById };
