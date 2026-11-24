const moment = require('moment');
const { ORDER, TIME_SLOT, USER } = require('../models');
const {
  checkGreaterStartAndTime,
  areArraysEqual,
  filterQuery,
  pagination,
  pushNotification,
  sendEmail,
} = require('../utils/helper');



const emailTemplate = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
        }

        .receipt {
          width: 80mm;
          margin: 0 auto;
          padding: 10px;
          font-size: 12px;
          border: 1px solid black;
        }
        
          p {
            margin: 0 0 10px;
          }
        
          .logo-box {
            width: 50px;
            margin: 0 auto 15px;
          }
        
          .holder {
            width: 100%;
            text-align: left;
          }
        
          .address {
            margin: 0 0 15px;
          }
        
          .date-holder {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 5px;
            margin-bottom: 5px;
        
            .date,
            .time,
            .text {
              display: block;
              margin-bottom: 5px;
            }
          }
        
          .ticket {
            display: block;
            text-transform: uppercase;
            padding: 5px 0 15px;
          }
        
          .head {
            width: 100%;
            margin: 0 0 15px;
            padding: 0 0 5px;
            border-bottom: 1px dashed #000;
            text-transform: uppercase;
        
            .wrap {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 10px;
            }
          }
        
          .list {
            list-style: none;
            margin: 0 0 5px;
            padding: 0;
        
            li {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 5px;
              padding: 5px 0;
            }
            .text {
              padding: 0 3px;
            }
            .name {
              display: block;
            }
          }
        
          .total-price {
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-transform: uppercase;
            gap: 5px;
            margin: 0 0 15px;
          }
          .qr-code {
            display: block;
            width: 100%;
            height: 50px;
            margin: 0 0 20px;
            background: rgba(0, 0, 0, 0.5);
          }
        
          .ticket-number {
            display: block;
            font-size: 20px;
            line-height: 24px;
            font-weight: 600;
            text-transform: uppercase;
            text-align: center;
            margin: 0 0 15px;
          }
        
          .thanks-text {
            display: block;
            text-align: center;
            font-weight: 500;
          }
        
          @media print {
            .receipt-container {
              page-break-after: always; /* Force new page after receipt */
              width: 80mm !important; /* Enforce width for printing */
        
            }
           
            @page {
              size: A4;
          margin: 0;
          /* Prevent scaling */
          zoom: 1;
            }

      </style>
    </head>
   
    <body>
    
     
      <div class="receipt">
        <div className="logo-box">
        {/* <Image src={logoImg} alt="logo" /> */}
      </div>
      
    
      <div className="address">
        <p>{"order?.address?.formatted_address"}</p>
        <span className="tel">Tel: {"order?.phone_number"}</span>
      </div>
      <div className="date-holder">
        <span className="date">{"order?.collection_date"}</span>
        <span className="time">{"order?.collection_time"}</span>
        <span className="text">SVR</span>
      </div>
      <span className="ticket">Customers Ticket</span>
      <div className="holder">
        <div className="head">
          <div className="wrap">
            <div className="due-date">Due Mon 06-02-2023</div>
            <div className="qty">
              PCS <span className="number">12</span>
            </div>
          </div>
          <span className="name">{"order?.name"}</span>
        </div>
        <ul className="list">
          {/* {order?.selected_services?.map((item) => {

            return ( */}
            <li>
              <div className="item-name">
                <span className="title">
                  <span className="numer">{"item?.quantity"}</span>
                  <span className="text">X</span>
                  <span className="text">{"item?.price"}</span>
                  {"-> Sheet Fit Single"}
                </span>
          
              </div>
              <span className="price">{"$"}</span>
            </li>
            {/* )
          }) 
          }

        </ul>

        <div className="total-price">
          <span className="text">Total Amount Due:</span>
          <span className="price">{"$"+"order?.orderPrice"}</span>
        </div>
        <span className="qr-code"></span>
        <span className="ticket-number">57092</span>
        <div className="thanks-text">
          <p>Thank you for choosing LaunderRemedy</p>
        </div>
      </div>
      
      </div>
     
    </body>
  </html>
        `


function generateUniqueID() {
  return Math.floor(10000 + Math.random() * 90000); // Generates a random 5-digit number
}

// Function to check if the generated ID is unique in the database
async function isIDUnique(id) {
  const existingOrder = await ORDER.findOne({ orderId: id });
  return !existingOrder; // Returns true if the ID is unique, false otherwise
}



exports.createOrder = async (req, res) => {
  let orderId;
  do {
    orderId = generateUniqueID();
  } while (!(await isIDUnique(orderId)));

  // Now you can save your order with this unique ID

  const user = req.user;
  const body = req.body;

  const orders = await ORDER.find();
  let updatedBundles = [];
  if (body?.bundles?.length > 0 && user?.bundles?.length > 0) {
    user?.bundles?.map((item) => {
      let obj = { ...item };
      body?.bundles?.map((item2) => {
        if (item?.id == item2?.id) {
          obj.remaining = obj?.prepaidTotalItems - item2?.purchasedQuantity;
        }
      })
      updatedBundles?.push(obj);
    })
  }

  const createdOrder = await ORDER.create({
    ...req.body,
    user_id: user._id,
    orderId: orderId
  });

  let adminList = await USER.find({ type: 'admin' });
  const adminFCMTokens = adminList.map(user => user.fcm_token);

  await USER.findByIdAndUpdate(user._id, { $set: { bundles: updatedBundles } });
  const updatedUser = await USER.findOne({ email: user?.email });
console.log(adminFCMTokens,'adminFCMTokensadminFCMTokensadminFCMTokens');
  adminFCMTokens.map(async (fcm_token) => {
    (await pushNotification({ title: 'Order Placed', body: 'New Order is Placed by ' + updatedUser?.first_name, token: fcm_token }));
  })
  user.fcm_token &&
    (await pushNotification({ title: 'Order Placed', body: 'Your order Created', token: user.fcm_token }));

  // await sendEmail({
  //   toList: [user?.email],
  //   subject: 'Order Placed! ',
  //   template: `<p>Your order is placed!</p>`,
  // });

  return res.status(200).send({
    code: 200,
    success: true,
    data: createdOrder,
    updatedUser: updatedUser
  });
};

exports.updateOrder = async (req, res) => {
  const { order_id } = req.body;

  const isOrder = await ORDER.findById(order_id);

  if (!isOrder) {
    throw new Error('Order Not Found:404');
  }

  if (isOrder.status !== 'pending') {
    throw new Error('Only the order is pending state will be updated:403');
  }

  const updatedOrder = await ORDER.findByIdAndUpdate(
    order_id,
    {
      ...req.body,
    },
    { new: true },
  );
  const user = await USER.findOne({ phone_number: req.body?.phone_number });
  let updatedBundles = [];
  if (req.body?.bundles?.length > 0 && user?.bundles?.length > 0) {
    user?.bundles?.map((item) => {
      let obj = { ...item };
      req.body?.bundles?.map((item2) => {
        if (item?.id == item2?.id) {
          obj.remaining = obj?.prepaidTotalItems - item2?.purchasedQuantity;
        }
      })
      updatedBundles?.push(obj);
    })
  }

  await USER.findByIdAndUpdate(req?.body?.user_id, { $set: { bundles: updatedBundles } });
  return res.status(200).send({
    code: 200,
    success: true,
    data: updatedOrder,
  });
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  await ORDER.findByIdAndDelete(id);

  return res.status(200).send({
    code: 200,
    success: true,
    data: 'Deleted',
  });
};

exports.cancelOrder = async (req, res) => {
  console.log("id", "ppopoopoppopopopoppoopopopop");

  const { id } = req.params;
  console.log(id, "ppopoopoppopopopoppoopopopop");
  await ORDER.findByIdAndUpdate(id, { $set: { status: 'cancelled' } });

  return res.status(200).send({
    code: 200,
    success: true,
    data: 'Order Cancelled Successfully.',
  });
};

exports.completeOrder = async (req, res) => {
  console.log("id", "ppopoopoppopopopoppoopopopop");

  const { id } = req.params;
  console.log(id, "ppopoopoppopopopoppoopopopop");
  await ORDER.findByIdAndUpdate(id, { $set: { status: 'completed' } });

  return res.status(200).send({
    code: 200,
    success: true,
    data: 'Order Completed Successfully.',
  });
};






exports.orderDetails = async (req, res) => {
  const { id } = req.params;

  const isOrder = await ORDER.findById(id);
  if (!isOrder) {
    throw new Error('Order Not Found:404');
  }

  return res.status(200).send({
    code: 200,
    success: true,
    data: isOrder,
  });
};

exports.getMyOrders = async (req, res) => {
  const { page, itemsPerPage, status, searchText } = filterQuery(req);

  const user = req.user;

  let query = {
    $and: [{ user_id: user._id }],
    $or: [],
  };

  if (status && status !== '') {
    query.$and.push({
      status: { $eq: status },
    });
  }
  if (searchText && searchText !== '') {
    const regex = new RegExp(searchText, 'i');

    query.$and.push({
      $or: [
        { totalPrice: { $regex: regex } },
        { postcode: { $regex: regex } },
        { first_name: { $regex: regex } },
        { last_name: { $regex: regex } },
        { orderId: { $regex: regex } },
        { phone_number: { $regex: regex } },

      ],
    });
  }

  if (!query.$and.length > 0) {
    delete query.$and;
  }

  if (!query.$or.length > 0) {
    delete query.$or;
  }
  const totalOrders = await ORDER.find(query).countDocuments();

  const orders = await ORDER.find(query)
    .skip((page - 1) * itemsPerPage)
    .limit(itemsPerPage)
    .lean();

  const data = pagination(orders, page, totalOrders, itemsPerPage);

  return res.status(200).send({
    code: 200,
    success: true,
    data: data,
  });
};
exports.getAllOrders = async (req, res) => {
  const { page, itemsPerPage, status, searchText } = filterQuery(req);

  const user = req.user;

  let query = {
    $and: [],
    $or: [],
  };

  if (user && user.type === 'user') {
    query.$and.push({
      user_id: user._id,
    });
  }

  if (status && status !== '') {
    query.$and.push({
      status: { $eq: status },
    });
  }
  if (searchText && searchText !== '') {
    const regex = new RegExp(searchText, 'i');

    query.$and.push({
      $or: [
        { totalPrice: { $regex: regex } },
        { postcode: { $regex: regex } },
        { first_name: { $regex: regex } },
        { last_name: { $regex: regex } },
        { orderId: { $regex: regex } },
        { phone_number: { $regex: regex } },
      ],
    });
  }

  if (!query.$and.length > 0) {
    delete query.$and;
  }

  if (!query.$or.length > 0) {
    delete query.$or;
  }
  const totalOrders = await ORDER.find(query).countDocuments();

  const orders = await ORDER.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * itemsPerPage)
    .limit(itemsPerPage)
    .lean();

  const data = pagination(orders, page, totalOrders, itemsPerPage);

  return res.status(200).send({
    code: 200,
    success: true,
    data: data,
  });
};
exports.getOrdersCount = async (req, res) => {
  const user = req.user;

  const detail = [
    { status: 'pending', count: 0, path: 'pending-orders' },
    { status: 'processing', count: 0, path: 'processing-order' },
    { status: 'completed', count: 0, path: 'completed-order' },
    { status: 'delivered', count: 0, path: 'delivered-order' },
    { status: 'cancelled', count: 0, path: 'cancelled-order' },
  ];
  console.log(user, 'useruser');
  let orders
  if (user?.type == 'admin') {
    orders = await ORDER.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
  } else {
    orders = await ORDER.aggregate([
      {
        $match: {
          user_id: user._id,
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
  }

  orders.forEach(order => {
    const statusIndex = detail.findIndex(d => d.status === order._id);
    if (statusIndex !== -1) {
      detail[statusIndex].count = order.count;
    }
  });

  return res.status(200).send({
    code: 200,
    success: true,
    data: detail,
  });
};


exports.addYearlyTimeSlots = async (req, res) => {
  try {
    const { year, range } = req.body;

    // Validate range
    const { success, message } = checkGreaterStartAndTime(range);
    if (!success) {
      throw new Error(message);
    }

    // Generate dates for the full year
    const startDate = moment(`${year}-01-01`);
    const endDate = moment(`${year}-12-31`);
    const slots = [];

    // Iterate through each day of the year
    for (let date = startDate.clone(); date.isSameOrBefore(endDate); date.add(1, 'day')) {
      slots.push({
        date: date.format('YYYY-MM-DD'),
        time_range: range,
      });
    }

    // Bulk insert slots into the database
    await TIME_SLOT.insertMany(slots);

    return res.status(200).send({
      code: 200,
      success: true,
      message: 'Time slots for the entire year have been added.',
      data: slots,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      success: false,
      message: 'Failed to add time slots for the year.',
    });
  }
};


exports.addTimeSlot = async (req, res) => {
  const { date, range } = req.body;

  const { success, message } = checkGreaterStartAndTime(range);

  if (!success) {
    throw new Error(message);
  }

  const isDatePresent = await TIME_SLOT.findOne({ date });

  if (isDatePresent) {
    if (areArraysEqual(range, isDatePresent.time_range)) {
      return res.status(409).send({
        code: 200,
        success: false,
        message: 'Date is already added with the same time range.',
      });
    } else {
      isDatePresent.time_range = range;
      await isDatePresent.save();

      return res.status(200).send({
        code: 200,
        success: true,
        data: isDatePresent,
        message: 'Date time range has been updated.',
      });
    }
  } else {
    const newTimeSlot = await TIME_SLOT.create({
      date: date,
      time_range: range,
    });

    return res.status(200).send({
      code: 200,
      success: true,
      data: newTimeSlot,
      message: 'New date has been added.',
    });
  }
};

exports.updateTimeSlot = async (req, res) => {
  const { id } = req.params;
  const { range } = req.body;

  const { success, message } = checkGreaterStartAndTime(range);

  if (!success) {
    throw new Error(message);
  }

  const isDatePresent = await TIME_SLOT.findById(id);

  if (!isDatePresent) {
    throw new Error('Record Not Found:404');
  }

  const updatedTimeRange = Array.from(
    [...range, ...isDatePresent.time_range].reduce((m, o) => m.set(o.start, o), new Map()).values(),
  );

  const timeSlot = await TIME_SLOT.findByIdAndUpdate(
    id,
    {
      $set: { time_range: updatedTimeRange },
    },
    { new: true },
  );

  return res.status(200).send({
    code: 200,
    success: true,
    data: timeSlot,
  });
};

exports.getCollectionSlots = async (req, res) => {
  
    try {
      const { date } = req.query;
  
      // Parse the provided date
      const dateObj = new Date(date);
      const year = dateObj.getUTCFullYear();
      const month = dateObj.getUTCMonth();
  
      // Calculate start and end of the month
      const startOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
      const lastDay = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
  
      console.log(startOfMonth, lastDay, "Start and End of Month");
  
      // Fetch slots from database
      let slots = await TIME_SLOT.find({
        date: { $gte: startOfMonth, $lt: lastDay },
      });
      console.log(slots, "Slots after MongoDB query");
  
      if (!slots.length) {
        return res.status(404).send({
          code: 404,
          success: false,
          message: "No slots found for the specified month",
        });
      }
  
      const currentDate = moment(date);
      console.log(currentDate.format('YYYY-MM-DD'), "Current Date");
  
      // Filter slots based on the provided date
      slots = slots.filter((slot) => {
        const slotDate = moment(slot.date);
        return slotDate.isSameOrAfter(currentDate, 'day');
      });
      console.log(slots, "Filtered Slots");
  
      let collection = [];
  
      slots.forEach((slotItem) => {
        const slotDate = moment(slotItem.date);
  
        if (slotDate.isSame(currentDate, 'day')) {
          // Filter today's time ranges based on the current time
          const currentTime = currentDate.format('HH:mm');
          console.log(currentTime, "Current Time");
  
          const range = slotItem.time_range.filter((r) => r.start > currentTime);
  
          if (range.length) {
            collection.push({
              label: 'today',
              value: 'today',
              timestamp: slotDate.format('YYYY-MM-DD'),
              range,
            });
          }
        } else if (slotDate.isSame(currentDate.clone().add(1, 'day'), 'day')) {
          // Tomorrow's slots
          collection.push({
            label: 'tomorrow',
            value: 'tomorrow',
            timestamp: slotDate.format('YYYY-MM-DD'),
            range: slotItem.time_range,
          });
        } else if (slotDate.isSame(currentDate, 'month')) {
          // Remaining slots for the month
          collection.push({
            label: slotDate.format('ddd, MMM DD'),
            value: slotDate.format('ddd, MMM DD'),
            timestamp: slotDate.format('YYYY-MM-DD'),
            range: slotItem.time_range,
          });
        }
      });
  
      console.log(collection, "Final Collection of Slots");
  
      return res.status(200).send({
        code: 200,
        success: true,
        data: collection,
      });
    } catch (error) {
      console.error(error, "Error fetching slots");
      return res.status(500).send({
        code: 500,
        success: false,
        message: "Internal server error",
      });
    }

  
};

exports.getDeliverySlot = async (req, res) => {
  const { date } = req.query;

  const dateObj = new Date(date);
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth();

  const lastDay = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)).toISOString();

  const slot = await TIME_SLOT.find({
    date: { $gt: dateObj, $lte: lastDay },
  }).sort([['date']]);

  let delivery = [];

  slot.forEach(slotItem => {
    const slotDate = moment(slotItem.date).format('YYYY-MM-DD');

    if (moment(slotItem.date).isSame(moment(date).add(1, 'day'), 'day')) {
      delivery.push({ label: 'tomorrow', value: 'tomorrow', timestamp: slotDate, range: slotItem.time_range });
    } else {
      const formattedDate = moment(slotItem.date).format('ddd, MMM, DD');
      delivery.push({ label: formattedDate, value: formattedDate, timestamp: slotDate, range: slotItem.time_range });
    }
  });

  return res.status(200).send({
    code: 200,
    success: true,
    data: delivery,
  });
};
