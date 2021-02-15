"use strict";

// Accounts Data
const account1 = {
  owner: "Sam Medriano",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movDates: [
    "2019-01-20T16:00:00.000Z",
    "2020-02-16T16:00:00.000Z",
    "2019-03-01T16:00:00.000Z",
    "2019-04-09T16:00:00.000Z",
    "2019-04-29T16:00:00.000Z",
    "2020-10-25T16:00:00.000Z",
    "2020-11-05T16:00:00.000Z",
    "2020-12-17T16:00:00.000Z",
  ],
  intRate: 1.2, // %
  pin: 2518,
};

const account2 = {
  owner: "Aimee Lorraine R. Medriano",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movDates: [
    "2019-01-20T16:00:00.000Z",
    "2020-02-16T16:00:00.000Z",
    "2019-03-01T16:00:00.000Z",
    "2019-04-09T16:00:00.000Z",
    "2019-04-29T16:00:00.000Z",
    "2020-10-25T16:00:00.000Z",
    "2020-11-05T16:00:00.000Z",
    "2020-12-17T16:00:00.000Z",
  ],
  intRate: 1.5,
  pin: 2518,
};

const account3 = {
  owner: "Gwyneth Lorraine R. Medriano",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movDates: [
    "2019-01-20T16:00:00.000Z",
    "2020-02-16T16:00:00.000Z",
    "2019-03-01T16:00:00.000Z",
    "2019-04-09T16:00:00.000Z",
    "2019-04-29T16:00:00.000Z",
    "2020-10-25T16:00:00.000Z",
    "2020-11-05T16:00:00.000Z",
    "2020-12-17T16:00:00.000Z",
  ],
  intRate: 0.7,
  pin: 2518,
};

const account4 = {
  owner: "Samuel McDane R. Medriano",
  movements: [430, 1000, 700, 50, 90, -10],
  movDates: [
    "2019-01-20T16:00:00.000Z",
    "2020-02-16T16:00:00.000Z",
    "2019-03-01T16:00:00.000Z",
    "2019-04-09T16:00:00.000Z",
    "2019-04-29T16:00:00.000Z",
    "2020-10-25T16:00:00.000Z",
  ],
  intRate: 1,
  pin: 2518,
};

// Accounts Array
const accounts = [account1, account2, account3, account4];

// Variables
const appContainer = document.querySelector(".app");
const balSummary = document.querySelector(".balance__value");
const welcomeMessage = document.querySelector(".welcome");
const incomeSum = document.querySelector(".summary__value--in");
const debitSum = document.querySelector(".summary__value--out");
const interestSum = document.querySelector(".summary__value--interest");
const movContainer = document.querySelector(".movements");

const username = document.querySelector(".login__input--user");
const password = document.querySelector(".login__input--pin");
const recipient = document.querySelector(".form__input--to");
const xferAmount = document.querySelector(".form__input--amount");
const loanAmount = document.querySelector(".form__input--loan-amount");
const closeUser = document.querySelector(".form__input--user");
const closeUserPin = document.querySelector(".form__input--pin");

const loginBtn = document.querySelector(".login__btn");
const transferBtn = document.querySelector(".form__btn--transfer");
const loanBtn = document.querySelector(".form__btn--loan");
const closeBtn = document.querySelector(".form__btn--close");

let currentAccount;

// Section: Login Verification

// Sign-in Event Listener
loginBtn.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find((acc) => acc.userID === username.value);

  if (currentAccount?.pin === +password.value) {
    // Show Account
    appContainer.style.opacity = 100;

    // Update Welcome Greeting
    welcomeMessage.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }.`;

    updateUI(currentAccount);
  } else {
    // Notify client that password is incorrect
    alert("You have entered an incorrect User ID or Password.");
  }

  // Clears the User ID and Password field after submitting
  username.value = password.value = "";
  password.blur();
});

// Initializer Functions
function createUserID(accnts) {
  accnts.forEach((acc) => {
    acc.userID = acc.owner
      .toLowerCase()
      .split(" ")
      .map((str) => str[0])
      .join("");
  });
}
createUserID(accounts);

function updateUI(curAcc) {
  // Calculate Balance
  calcBalance(curAcc);

  // Calculate Summary
  calcSummary(curAcc);

  // Display Movements
  displayMov(curAcc);

  // Start/Restart Logout Timer
}

// Calculate Balance
function calcBalance(acc) {
  const calcBalance = acc.movements.reduce((acc, curVal) => acc + curVal);
  balSummary.textContent = `₱${calcBalance}`;

  acc.balance = calcBalance;
}

// Calculate Summary
function calcSummary(acc) {
  const deposits = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curVal) => acc + curVal);
  incomeSum.textContent = `₱${deposits}`;

  const debits = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, curVal) => acc + curVal);
  debitSum.textContent = `₱${debits}`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * acc.intRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, curVal) => acc + curVal);
  interestSum.textContent = `₱${interest}`;
}

// Stopped at this section.  To be continued.
function displayMov(acc) {
  movContainer.innerHTML = "";

  const movs = acc.movements;

  movs.forEach((trans, i) => {
    const type = trans > 0 ? "deposit" : "withdrawal";

    const html = `
    <div class="movements__row">
      <div class="movements__date">3 days ago</div>
      <div class="movements__type--${type} movements__value">${trans}</div>
    </div>
    `;

    movContainer.insertAdjacentHTML("afterbegin", html);
  });
}

// Feature: Transfer Money

// 1. Validate if transfer to account exists.
transferBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const receiver = accounts.find((acc) => acc.userID === recipient.value);
  const amount = +xferAmount.value;

  // This validates if amount is less than zero, current account has enough funds to transfer, and transfer to account exist and is not equal to the current account.
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiver &&
    receiver?.userID !== currentAccount.userID
  ) {
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);

    updateUI(currentAccount);
  } else {
    alert(
      "Transaction Error: Either balance is not enough or receiver account is not valid."
    );
  }

  recipient.value = xferAmount.value = "";
  xferAmount.blur();
});

// Feature: Request Loan
loanBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = +loanAmount.value;

  if (
    amount > 0 &&
    currentAccount.movements.some((tran) => tran >= amount / 10)
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);

    alert(
      `Congratulations, ${currentAccount.owner}.  Your $${amount} loan just got approved and has been deposited to your account.`
    );
  } else {
    console.log("Sorry but you are not qualified MTF!");
  }

  loanAmount.value = "";
  loanAmount.blur();
});

// Feature: Close Account

closeBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Locate the account in the accounts array
  if (
    closeUser.value === currentAccount.userID &&
    +closeUserPin.value === currentAccount.pin
  ) {
    const toDelete = accounts.findIndex(
      (acc) => acc.userID === closeUser.value
    );

    accounts.splice(toDelete, 1);
    // console.log(accounts);

    init();
  } else {
    alert(
      "Sorry, either the Account User ID or Password you have entered is incorrect.  Please try again."
    );
  }

  closeUser.value = closeUserPin.value = "";
  closeUserPin.blur();
});

function init() {
  appContainer.style.opacity = 0;
  welcomeMessage.textContent = "Login to get started";
}
