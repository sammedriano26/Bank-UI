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
const loginBtn = document.querySelector(".login__btn");
const username = document.querySelector(".login__input--user");
const password = document.querySelector(".login__input--pin");
const appContainer = document.querySelector(".app");
const balSummary = document.querySelector(".balance__value");
const welcomeMessage = document.querySelector(".welcome");
const incomeSum = document.querySelector(".summary__value--in");
const debitSum = document.querySelector(".summary__value--out");
const interestSum = document.querySelector(".summary__value--interest");
const movContainer = document.querySelector(".movements");

let currentAccount;

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

  console.log(acc);
  console.log(movs);

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