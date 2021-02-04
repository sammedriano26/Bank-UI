"use strict";

// Data
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

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");
const greeting = document.querySelector(".owner__name");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
const logoutButton = document.querySelector(".logout");

// Calculations==========================================================================================

// Show Transaction History
const displayTransactionHistory = (acc, sort = false) => {
  // Clears Movements container
  containerMovements.innerHTML = "";

  // Slice here creates a copy of the original activities array, then sorted it out when the button is clicked.  Else, it retains its original position.
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((transactions, i) => {
    // Create conditional to test if the activity is a deposit or withdrawal
    const type = transactions > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movDates[i]);
    const day = date.getDate();
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = `${date.getFullYear()}`.padStart(2, 0);
    const displayDate = `${month}/${day}/${year}`;

    // The HTML File to be inserted
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${transactions}</div>
    </div>
      `;

    // Used to insert the HTML block to the Movements container
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Calculate the Balance and update UI
// 1. Calculate the transactions
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curVal) => acc + curVal, 0);

  // 2. Get the total and print it to the UI.
  labelBalance.textContent = `₱${acc.balance}`;
};

// Calculate the summary.
const calcDisplaySummary = function (acc) {
  // Calculate the input summary
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curVal) => acc + curVal);
  labelSumIn.textContent = `₱${income}`;
  // Calculate the output summary
  const expenses = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, curVal) => acc + curVal);
  labelSumOut.textContent = `₱${Math.abs(expenses)}`;
  // Calculate the Interest
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposits) => (deposits * acc.intRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, curVal) => acc + curVal);
  labelSumInterest.textContent = `₱${interest}`;
};


// Logout Timer
const startLogOutTimer = function() {
  // Designed to start the timer right away.
  const tick = () => {
    // Set the minute and seconds
    const min = `${parseInt(time / 60)}`.padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    // print the time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    // When time hits 0, logout user
    if(time === 0) {
      clearInterval(timer);
      init();
    };

    // For each call, deduct 1 seconds to the timer. (place this at the bottom to make sure it won't logout at 1 sec)
    time--; 
  };

  // Initiate logout timer and set it to 1 minute.
  let time = 300;

  // Make sure to run this to run the counter asap.
  tick();
  // Call the timer every seconds.
  const timer = setInterval(tick, 1000);

  return timer;
};




// Login Functionality ==========================================================================================

// Creating the Username by looping over and modifying the accounts array
const createUserID = function (accts) {
  accts.forEach((accs) => {
    // Modifying the Account.owner string and saving it on the Account.userID variable.
    accs.userID = accs.owner
      .toLowerCase()
      .split(" ")
      .map((str) => str[0])
      .join("");
  });
};

createUserID(accounts);

// Update the UI
const updateUI = function (acc) {
  // Display Movements and generate the transaction history for the selected account.
  displayTransactionHistory(acc);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary and pass in the entire account.
  calcDisplaySummary(acc);

  // Just playing around here to add a background color on each row using mathematical calculations.
  [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
    if (i % 2 !== 0) row.style.backgroundColor = "#f9f9f9";
  });

  // Set the date upon logging in - format is in mm/dd/year
  labelDate.textContent = today();
};

// Set-up Rules for the login Functionality

// We placed this outside of the function just in case we'll need to use this for another methods.
let currentAccount, timer;

// 1. Receive the input from the userID and password input fields
btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  // Checks the current Account based on the userID input value.
  currentAccount = accounts.find(
    (acc) => acc.userID === inputLoginUsername.value
  );

  // Conditional Chaining is applied here using the question mark to avoid encountering an error when the user puts in an invalid User ID.  Basically, the ? here will test if the userID is valid, else it will not proceed with the conditional.
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Update Welcome Message uses split to just display first name
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }!`;
    containerApp.style.opacity = 100;

    // Update the Transaction History, Balance, and Summary
    updateUI(currentAccount);

    // Initiate the timer and clears if there's an existing timer.
    if(timer) clearInterval(timer);
    timer = startLogOutTimer();

  } else {
    console.log(
      "You have entered an invalid User ID or Password.  Please try again!"
    );
  }

  // Clears the Input fields.
  inputLoginUsername.value = inputLoginPin.value = "";
  // Removes the focus to the pin field.
  inputLoginPin.blur();
});

// Transfering of Funds ==========================================================================================

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  // Receives the transfer to account value and loops over the accounts array to check each individual accounts if the accoount owner is equal to the transfer to value.
  const receiverAccount = accounts.find(
    (acc) => acc.userID === inputTransferTo.value
  );

  /*
  Things to consider:
  1. Only allow transfer if transfer to account is a valid account.
  2. Only allow transfer is the funds from the transfer from account is suffient.
  3. Only allow transfer if the transfer amount is a positive value.
  */

  // Note!  The question mark here validates if the receiver account exist in the accounts array.  If this returns false, the whole operand returns false.
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAccount &&
    receiverAccount?.userID !== currentAccount.userID
  ) {
    // Add the amount to the recipient account and deducts the amount from the current account
    currentAccount.movements.push(-amount);
    currentAccount.movDates.push(new Date().toISOString());
    receiverAccount.movements.push(amount);
    receiverAccount.movDates.push(new Date().toISOString());

    // Update the Transaction History, Balance, and Summary
    updateUI(currentAccount);

    // Confirms the transfer was completed.
    console.log(
      `You've successfully sent $${amount} to ${receiverAccount.owner}.`
    );
  }

  // Clear the input fields and remove the cursor from the amount field
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();

  // Resets timer
  resetTimer();
});

// Requesting Loans ==========================================================================================

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  /*
    Rule for loans: The bank will only allow loan approvals if the account requesting the loan has at least one deposit made that is 10% of the loanable amount.

    Tip: Use the method some for this.
  */

  const amount = +inputLoanAmount.value;

  // Check if there's any deposit that is equivalent to at least 10% of the loanable amount using the Some method.
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount / 10)
  ) {

    // Create a delay for the posting.
    setTimeout(() => {
      // Add loanable amount to balance and update UI
        currentAccount.movements.push(amount);
        currentAccount.movDates.push(new Date().toISOString());
        updateUI(currentAccount);

        console.log(`Congratulations, ${currentAccount.owner}.  Your loan for ₱${amount} was approved and is now deposited to your account.`);
    }, 5000);


      // Clear Fields
      inputLoanAmount.value = "";
      inputLoanAmount.blur();

  } else {
    alert(
      "Your loanable amount cannot be approved at this time. Please try again later."
    );

    // Clear Fields
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
  }

    // Resets timer
    resetTimer();
});

// Closing Acounts ==========================================================================================

// Close Account

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  // 1. Check if the userID and the pin being entered is accurate
  if (
    inputCloseUsername.value === currentAccount.userID &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // This will look for the specific account in the array.
    const index = accounts.findIndex(
      (acc) => acc.userID === currentAccount.userID
    );

    // This will then delete that specific account using the splice method.
    accounts.splice(index, 1);

    // clear the input fields
    inputCloseUsername.value = inputClosePin.value = "";
    inputClosePin.blur();

    init();
  }
});

// Logging out of Account ==========================================================================================

logoutButton.addEventListener("click", init);

function init() {
  containerApp.style.opacity = 0;
  labelWelcome.textContent = "Login to get started";
};

// Getting the overall Balance of the account using map.
const overAllBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

// Getting the overall balance of the account using flatMap.
const overAllBalance2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

// Sorting Balances ==========================================================================================
// Declare a variable that saves the current state of the movements, whether it is being sorted or not sorted.
let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();

  // We set sorted to !sorted here because we want sorted here to return true if the sorted state is false.
  displayTransactionHistory(currentAccount.movements, !sorted);
  // Create the flip in case the sorted state is already true.
  sorted = !sorted;
});

labelBalance.addEventListener("click", () => {
  // You can use the spread operator but you will have to map the array separately.

  // const movFromUI2 = [...document.querySelectorAll('.movements__value')];

  // console.log(movFromUI2.map(el => +(el.textContent)));

  // With Array.from, you can map it right away.
  const movFromUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (num) => +num.textContent
  );

  console.log(movFromUI);
});

//  We can add the date using this function if we want the full month.
// function today() {
//   // gets today's date and print it in mm/dd/yyyy format.

//   const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

//   const now = new Date();
//   const month = now.getMonth();
//   const date = now.getDate();
//   const year = now.getFullYear();
//   const curMonth = months.find(item => item[month])

//   return [curMonth, date, year].join('/');
// };

function today() {
  const now = new Date();
  // padStart here makes sure that there will always be two digits in this string; else, it adds a zero.
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const date = `${now.getDate()}`.padStart(2, 0);
  const year = now.getFullYear();
  const hour = `${now.getHours()}`.padStart(2, 0);
  const minute = `${now.getMinutes()}`.padStart(2, 0);

  return `${month}/${date}/${year}` + " " + `${hour}:${minute}`;
}

function fakeLogin() {
  currentAccount = account1;
  updateUI(currentAccount);
  containerApp.style.opacity = 100;
};

// fakeLogin();

function resetTimer() {
  clearInterval(timer);
  timer = startLogOutTimer();
};




/* To be finished problem:
  1. If you logout of one account and login to another, the timers are alternating.
  2. Fix this by checking if a timer is running and clear the running timer.
  3. Stopped at 20:05/28:31
*/



// This will be a function that we'll implement soon. This will track if the user is currently hovering the mouse or doing something in general to the page.

// function isActive() {
//   // checks if the user is moving the mouse or typing something
//   // freeze the timer and initiate it only when the user stops doing anything

// }






