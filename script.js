'use strict';


// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

// Functions

// emptying the movements boxes
const displayMovements = function (accs, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? accs.movements.slice().sort((a, b) => a - b)
    : accs.movements;

  movs.forEach(function (mov, i) {
    // to determine whether its deposit or withdrawal
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // date
    const date = new Date(accs.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    // manipulating the each box according to the input elements of array
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>`;

    // adding this boxes into the html movementCOntainer
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// finding the current balance in the account and displaying it
const calcDisplayBalance = function (accs) {
  // finding the tot using reduce method
  accs.balance = accs.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  // displying the current balance
  labelBalance.textContent = `${accs.balance}€`;
};

// finding the below statistics
const calcDisplaySummary = function (accs) {
  // income should have the positive values added up
  // first we can use filter method to have only the +ve values
  // second we can use reduce method to cal the tot
  const income = accs.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  // we can now display the income result
  labelSumIn.textContent = `${income.toFixed(2)}€`;

  // now we can calculate the out summary
  const out = accs.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  // now we can find the interest. Interest will be 1.2 and it will applied to every deposit
  const interest = accs.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * accs.interestRate) / 100)
    .filter(ele => ele > 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

// finding the usernames for each account. The username will be the starting letters of their name in lc.
const createUserNames = function (accs) {
  for (const acc of accs) {
    acc.userName = acc.owner
      .split(' ')
      .map(ele => ele[0])
      .join('')
      .toLowerCase();
  }
};

createUserNames(accounts);
// console.log(account1.userName);

// Now we have to implement the login feature.

const ui = function (accs) {
  // displaying the movements
  displayMovements(accs);

  // displying the balance
  calcDisplayBalance(accs);

  // displying the summary
  calcDisplaySummary(accs);
};

const startLogOutTimer = function () {
  const tick = function () {
    // In each call print the remaining timer to the UI
    const min = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const secs = `${time % 60}`.padStart(2, 0);
    labelTimer.textContent = `${min}:${secs}`;

    // When 0, stop timer and log out the user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      // bring opacity to 0
      containerApp.style.opacity = 0;
    }
    // Decrease 1s
    time--;
  };
  // Set timer to 5 minutes
  let time = 60 * 5;

  tick();
  // Call the timer every second
  const timer = setInterval(tick, 1000);
  return timer;
};

/////////////////////
// Event handlers
let currentAccount, timer;

// ALWAYS FAKE LOGIN
// currentAccount = account1;
// ui(currentAccount);
// containerApp.style.opacity = 100;

// IMPLEMENTING LOGIN
btnLogin.addEventListener('click', function (e) {
  //Prevent FORM from submitting
  e.preventDefault();

  // finding the username object
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  // checking for correct credentials
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // DISPLAYING WELCOME MESSAGE
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    // displying empty page when logging in
    containerApp.style.opacity = 100;

    // Current date and time
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = now.getHours();
    const min = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    // Erasing the username and pin after login
    inputLoginUsername.value = inputLoginPin.value = '';
    // removing the focus on pin box
    inputLoginPin.blur();

    // Calling the timer function
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // DISPLAYING THE RESPECTIVE UI PAGE
    ui(currentAccount);
  }
});

// IMPLEMENTING TRANSFER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const recvrAcc = accounts.find(acc => acc.userName === inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);

  // we have to check if the recr acc exist and if the sender has enough amount and the sender is sending a positive value
  if (
    currentAccount.balance >= amount &&
    amount > 0 &&
    recvrAcc &&
    recvrAcc?.userName !== currentAccount.userName
  ) {
    // TRANSFER MONEY

    // Pushing - amount in the current account
    currentAccount.movements.push(-amount);
    // Pushing  amount in the recvr account
    recvrAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    recvrAcc.movementsDates.push(new Date().toISOString());

    // UPDATE UI
    ui(currentAccount);

    // Resetting timer
    clearInterval(timer);
    timer = startLogOutTimer();
    // erasing the transferto and amt after transfering
    inputTransferAmount.value = inputTransferTo.value = '';
  }
});

// IMPLEMENTING LOAN BTN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (currentAccount.movements.some(mov => amount > 0.1 * mov)) {
    // implementing timeOut fn in displaying loan amt
    setTimeout(function () {
      // any deposit should be greater than 10% of the requesting amount

      // adding positive movement to the current account
      currentAccount.movements.push(amount);

      //Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // updating UI
      ui(currentAccount);
      // reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';

  // amount = '';
});
// IMPLEMENTING CLOSE ACCOUNT BTN
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // Checking for correct credentials
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // Deleting user from the array products
    // finding the index number
    const index = accounts.findIndex(
      accs => accs.userName === currentAccount.userName
    );
    console.log(index);
    // deleting the account using splice
    accounts.splice(index, 1);

    // now we have to hide the UI
    containerApp.style.opacity = 0;
    console.log(currentAccount);
  }
  inputCloseUsername = inputClosePin = '';
});

// IMPLEMENTING SORTING BTN
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('h');
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

