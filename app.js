/* =========================================
   CARZA V7
   Front-end prototype
========================================= */


/* DEMO VEHICLES */

const demoCars = [

  {
    id: 1,
    make: "Toyota",
    model: "Fortuner 2.4 GD-6",
    year: 2023,
    price: 429900,
    mileage: 62000,
    transmission: "Automatic",
    fuel: "Diesel",
    location: "Johannesburg",
    body: "SUV",
    dealer: "CARZA Founding Motors",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85"
  },

  {
    id: 2,
    make: "Volkswagen",
    model: "Tiguan 1.4 TSI",
    year: 2022,
    price: 369900,
    mileage: 47000,
    transmission: "Automatic",
    fuel: "Petrol",
    location: "Pretoria",
    body: "SUV",
    dealer: "Capital Auto Gallery",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85"
  },

  {
    id: 3,
    make: "BMW",
    model: "320i M Sport",
    year: 2021,
    price: 399900,
    mileage: 58000,
    transmission: "Automatic",
    fuel: "Petrol",
    location: "Johannesburg",
    body: "Sedan",
    dealer: "Premium Drive",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85"
  },

  {
    id: 4,
    make: "Ford",
    model: "Ranger 2.0 Bi-Turbo",
    year: 2024,
    price: 549900,
    mileage: 18000,
    transmission: "Automatic",
    fuel: "Diesel",
    location: "Cape Town",
    body: "Bakkie",
    dealer: "Cape Coast Auto",
    image:
      "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=85"
  }

];


/* STORAGE */

const STORAGE_KEY = "carza_v7_listings";
const USER_KEY = "carza_v7_user";


function getListings() {

  return JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );

}


function saveListings(listings) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(listings)
  );

}


function getUser() {

  return JSON.parse(
    localStorage.getItem(USER_KEY) || "null"
  );

}


/* MONEY */

function formatMoney(value) {

  return "R" + Number(value).toLocaleString("en-ZA");

}


/* ALL APPROVED VEHICLES */

function getAllApprovedCars() {

  const uploaded = getListings()
    .filter(car => car.status === "approved");

  return [
    ...demoCars,
    ...uploaded
  ];

}


/* CAR CARD */

function createCarCard(car) {

  return `

    <article class="car-card">

      <img
        src="${car.image}"
        alt="${car.make} ${car.model}"
        onerror="this.style.display='none'"
      >

      <div class="car-info">

        <h3>
          ${car.year} ${car.make} ${car.model}
        </h3>

        <div class="car-price">
          ${formatMoney(car.price)}
        </div>

        <div class="car-meta">

          ${Number(car.mileage).toLocaleString()} km
          · ${car.transmission}
          · ${car.fuel}

          <br>

          📍 ${car.location}

          <br>

          🏪 ${car.dealer}

        </div>

      </div>

    </article>

  `;

}


/* MOBILE MENU */

function toggleMenu() {

  const nav = document.getElementById("mainNav");

  if (nav) {

    nav.classList.toggle("open");

  }

}


/* HOME */

const featuredCars =
  document.getElementById("featuredCars");


if (featuredCars) {

  featuredCars.innerHTML =
    getAllApprovedCars()
      .slice(0, 4)
      .map(createCarCard)
      .join("");

}


/* HOME SEARCH */

function searchFromHome() {

  const query =
    document.getElementById("homeSearch").value;

  const location =
    document.getElementById("homeLocation").value;

  const price =
    document.getElementById("homePrice").value;


  const params = new URLSearchParams();

  if (query)
    params.set("q", query);

  if (location)
    params.set("location", location);

  if (price)
    params.set("price", price);


  window.location.href =
    "cars.html?" + params.toString();

}


/* MARKETPLACE */

const carsGrid =
  document.getElementById("carsGrid");


if (carsGrid) {

  const params =
    new URLSearchParams(window.location.search);


  document.getElementById("searchInput").value =
    params.get("q") || "";

  document.getElementById("locationFilter").value =
    params.get("location") || "";

  document.getElementById("priceFilter").value =
    params.get("price") || "";


  filterCars();

}


function filterCars() {

  const query =
    document.getElementById("searchInput")
      ?.value
      .toLowerCase() || "";


  const location =
    document.getElementById("locationFilter")
      ?.value || "";


  const maxPrice =
    Number(
      document.getElementById("priceFilter")
        ?.value || Infinity
    );


  const body =
    document.getElementById("bodyFilter")
      ?.value || "";


  const results =
    getAllApprovedCars().filter(car => {

      const searchable =
        `${car.make} ${car.model} ${car.dealer}`
          .toLowerCase();


      return (

        (!query || searchable.includes(query)) &&

        (!location ||
          car.location === location) &&

        car.price <= maxPrice &&

        (!body ||
          car.body === body)

      );

    });


  const grid =
    document.getElementById("carsGrid");


  const counter =
    document.getElementById("resultsCount");


  if (!grid) return;


  if (counter) {

    counter.textContent =
      `${results.length} vehicle${
        results.length === 1 ? "" : "s"
      } found`;

  }


  grid.innerHTML =
    results.length

      ? results.map(createCarCard).join("")

      : "<p>No vehicles match your search.</p>";

}


/* DEALER DIRECTORY */

const dealerGrid =
  document.getElementById("dealerGrid");


if (dealerGrid) {

  const dealers = [

    {
      name: "CARZA Founding Motors",
      vehicles: 86
    },

    {
      name: "Capital Auto Gallery",
      vehicles: 54
    },

    {
      name: "Premium Drive",
      vehicles: 41
    },

    {
      name: "Cape Coast Auto",
      vehicles: 32
    }

  ];


  dealerGrid.innerHTML =
    dealers.map(dealer => `

      <article class="dealer-card">

        <div class="dealer-icon">
          ${dealer.name.charAt(0)}
        </div>

        <h3>
          ${dealer.name}
        </h3>

        <p>
          Verified dealer profile
        </p>

        <strong>
          ${dealer.vehicles} vehicles
        </strong>

        · ★ 4.9

      </article>

    `).join("");

}


/* DEALER AUTH */

const signupForm =
  document.getElementById("signupForm");


const loginForm =
  document.getElementById("loginForm");


if (signupForm) {

  const currentUser = getUser();

  if (currentUser) {

    renderDealerDashboard();

  }


  signupForm.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      const name =
        document.getElementById("signupName").value;

      const email =
        document.getElementById("signupEmail")
          .value
          .toLowerCase();

      const password =
        document.getElementById("signupPassword")
          .value;


      const account = {

        name,
        email,
        password

      };


      localStorage.setItem(
        "carza_account_" + email,
        JSON.stringify(account)
      );


      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          name,
          email
        })
      );


      renderDealerDashboard();

    }

  );

}


if (loginForm) {

  loginForm.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      const email =
        document.getElementById("loginEmail")
          .value
          .toLowerCase();


      const password =
        document.getElementById("loginPassword")
          .value;


      let account =
        JSON.parse(
          localStorage.getItem(
            "carza_account_" + email
          ) || "null"
        );


      /* DEMO ACCOUNT */

      if (
        !account &&
        email === "demo@carza.co.za" &&
        password === "carza123"
      ) {

        account = {

          name: "CARZA Demo Motors",
          email

        };

      }


      if (!account) {

        alert(
          "Account not found. Please create a dealer account first."
        );

        return;

      }


      if (
        account.password &&
        account.password !== password
      ) {

        alert("Incorrect password.");

        return;

      }


      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          name: account.name,
          email: account.email
        })
      );


      renderDealerDashboard();

    }

  );

}


/* DASHBOARD */

function renderDealerDashboard() {

  const authentication =
    document.getElementById("authentication");

  const dashboard =
    document.getElementById("dashboard");

  const upload =
    document.getElementById("vehicleUpload");


  if (!dashboard) return;


  authentication.classList.add("hidden");

  dashboard.classList.remove("hidden");

  upload.classList.add("hidden");


  const user =
    getUser();


  document.getElementById(
    "dealerWelcome"
  ).textContent =
    "Welcome, " + user.name + ".";


  const listings =
    getListings()
      .filter(car =>
        car.email === user.email
      );


  const live =
    listings.filter(
      car => car.status === "approved"
    ).length;


  const pending =
    listings.filter(
      car => car.status === "pending"
    ).length;


  document.getElementById(
    "dealerStats"
  ).innerHTML = `

    <div class="stat">

      <small>LISTINGS</small>

      <strong>
        ${listings.length}
      </strong>

    </div>


    <div class="stat">

      <small>LIVE</small>

      <strong>
        ${live}
      </strong>

    </div>


    <div class="stat">

      <small>PENDING</small>

      <strong>
        ${pending}
      </strong>

    </div>


    <div class="stat">

      <small>PLAN</small>

      <strong>
        LAUNCH
      </strong>

    </div>

  `;


  const stock =
    document.getElementById(
      "dealerStock"
    );


  stock.innerHTML = listings.length

    ? listings.map(car => `

      <div class="stock-row">

        <img
          src="${car.image}"
          alt=""
        >

        <div>

          <strong>
            ${car.year}
            ${car.make}
            ${car.model}
          </strong>

          <small>
            ${formatMoney(car.price)}
          </small>

        </div>


        <span
          class="status ${
            car.status === "approved"
              ? "approved"
              : ""
          }"
        >

          ${car.status}

        </span>

      </div>

    `).join("")

    : "<p>No listings yet.</p>";

}


/* SHOW UPLOAD FORM */

function showVehicleForm() {

  document
    .getElementById("dashboard")
    .classList.add("hidden");


  document
    .getElementById("vehicleUpload")
    .classList.remove("hidden");

}


/* BACK TO DASHBOARD */

function showDashboard() {

  document
    .getElementById("vehicleUpload")
    .classList.add("hidden");


  document
    .getElementById("dashboard")
    .classList.remove("hidden");


  renderDealerDashboard();

}


/* LOGOUT */

function logoutDealer() {

  localStorage.removeItem(USER_KEY);

  window.location.reload();

}


/* VEHICLE UPLOAD */

const vehicleForm =
  document.getElementById("vehicleForm");


if (vehicleForm) {

  vehicleForm.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      const user =
        getUser();


      if (!user) {

        alert("Please log in first.");

        return;

      }


      const vehicle = {

        id: Date.now(),

        make:
          document.getElementById(
            "vehicleMake"
          ).value,

        model:
          document.getElementById(
            "vehicleModel"
          ).value,

        year:
          Number(
            document.getElementById(
              "vehicleYear"
            ).value
          ),

        price:
          Number(
            document.getElementById(
              "vehiclePrice"
            ).value
          ),

        mileage:
          Number(
            document.getElementById(
              "vehicleMileage"
            ).value
          ),

        location:
          document.getElementById(
            "vehicleLocation"
          ).value,

        body:
          document.getElementById(
            "vehicleBody"
          ).value,

        transmission:
          document.getElementById(
            "vehicleTransmission"
          ).value,

        fuel:
          document.getElementById(
            "vehicleFuel"
          ).value,

        dealer:
          user.name,

        email:
          user.email,

        image:
          document.getElementById(
            "vehicleImage"
          ).value ||
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",

        status:
          "pending"

      };


      const listings =
        getListings();


      listings.push(vehicle);


      saveListings(listings);


      alert(
        "Vehicle submitted! It is now waiting for moderation."
      );


      vehicleForm.reset();


      showDashboard();

    }

  );

}


/* ADMIN */

const moderationQueue =
  document.getElementById(
    "moderationQueue"
  );


if (moderationQueue) {

  renderAdmin();

}


function renderAdmin() {

  const listings =
    getListings();


  const pending =
    listings.filter(
      car => car.status === "pending"
    );


  const approved =
    listings.filter(
      car => car.status === "approved"
    );


  const rejected =
    listings.filter(
      car => car.status === "rejected"
    );


  const stats =
    document.getElementById(
      "adminStats"
    );


  if (stats) {

    stats.innerHTML = `

      <div class="stat">

        <small>TOTAL</small>

        <strong>
          ${listings.length}
        </strong>

      </div>


      <div class="stat">

        <small>PENDING</small>

        <strong>
          ${pending.length}
        </strong>

      </div>


      <div class="stat">

        <small>APPROVED</small>

        <strong>
          ${approved.length}
        </strong>

      </div>


      <div class="stat">

        <small>REJECTED</small>

        <strong>
          ${rejected.length}
        </strong>

      </div>

    `;

  }


  if (!moderationQueue) return;


  moderationQueue.innerHTML =
    pending.length

      ? pending.map(car => `

        <div class="queue-row">

          <img
            src="${car.image}"
            alt=""
          >

          <div>

            <strong>
              ${car.year}
              ${car.make}
              ${car.model}
            </strong>

            <small>

              ${formatMoney(car.price)}
              · ${car.dealer}

            </small>

          </div>


          <div class="queue-actions">

            <button
              class="approve"
              onclick="moderateVehicle(
                ${car.id},
                'approved'
              )"
            >
              APPROVE
            </button>


            <button
              class="reject"
              onclick="moderateVehicle(
                ${car.id},
                'rejected'
              )"
            >
              REJECT
            </button>

          </div>

        </div>

      `).join("")

      : "<p>No vehicles waiting for moderation.</p>";

}


/* APPROVE / REJECT */

function moderateVehicle(
  id,
  newStatus
) {

  const listings =
    getListings();


  const vehicle =
    listings.find(
      car => car.id === id
    );


  if (!vehicle) return;


  vehicle.status =
    newStatus;


  saveListings(listings);


  renderAdmin();

}


/* RESET */

function resetDemoData() {

  if (
    !confirm(
      "Reset all uploaded demo listings?"
    )
  ) {

    return;

  }


  localStorage.removeItem(
    STORAGE_KEY
  );


  window.location.reload();

    }
