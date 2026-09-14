# TruckHOS

A full-stack trip planning application for interstate truck drivers.

TruckHOS takes a driver's current location, pickup location, dropoff location, and current cycle hours, then creates a planned trip with the route, required stops and rests, daily schedule, and ELD logs.

The goal of the project is to make it easier to plan a trip while taking the driver's Hours of Service (HOS) limits into account.

## Assessment

This project was built as part of a Full Stack Developer coding assessment.

The assessment required:

- React frontend
- Django backend
- Trip planning based on driver inputs
- A map showing the route
- Information about stops and rests
- Daily ELD log sheets
- Multiple daily logs for longer trips
- A hosted version of the application
- GitHub source code
- A short Loom walkthrough

## How It Works

The driver starts by entering:

1. Current location
2. Pickup location
3. Dropoff location
4. Current cycle used in hours

TruckHOS then uses these details to build the trip.

The main flow is:

```text
Trip Details
     ↓
Route Calculation
     ↓
HOS Planning
     ↓
Stops & Rest Periods
     ↓
Daily Trip Schedule
     ↓
Daily ELD Logs
````

The ELD logs are generated from the same schedule used for the trip, so the logs represent the activities planned for each day.

## HOS Assumptions

The assessment provides the following assumptions, which are used by the application:

* Property-carrying driver
* 70 hours / 8 days cycle
* No adverse driving conditions
* Fueling at least once every 1,000 miles
* 1 hour for pickup
* 1 hour for dropoff

The application focuses on these assumptions rather than trying to implement every possible HOS exception.

## Main Features

### Trip Planning

The user can enter:

* Current location
* Pickup location
* Dropoff location
* Current cycle used

The application then generates the trip plan.

### Route Map

The result page displays the planned route on a map.

The map also shows relevant trip stops such as:

* Pickup
* Dropoff
* Fuel stops
* Rest stops

A free map/routing service is used for the route information.

### Trip Schedule

The generated trip is divided into daily activities.

Depending on the trip, the schedule can include:

* Driving
* Fueling
* Pickup
* Dropoff
* Rest
* Sleeper berth
* Other on-duty activities

Longer trips are automatically split across multiple days.

### ELD Logs

TruckHOS generates a daily 24-hour ELD log for each day of the trip.

The log uses the main duty-status categories:

* Off Duty
* Sleeper Berth
* Driving
* On Duty (Not Driving)

The log is drawn based on the schedule generated for that day.

For longer trips, multiple daily log sheets are generated.

## Technology Stack

### Frontend

* React
* TypeScript
* HTML
* CSS
* Framer Motion

### Backend

* Django
* Django REST Framework

### APIs / Services

* Map and routing API
* REST API between React and Django

## Project Structure

```text
truckhos/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── ...
│
├── backend/
│   ├── manage.py
│   ├── ...
│   └── ...
│
└── README.md
```


## Running Locally

### Prerequisites

Make sure you have installed:

* Node.js
* Python 3
* pip
* Git

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend

python -m venv venv
```

Activate the virtual environment.

Windows:

```bash
venv\Scripts\activate
```

macOS/Linux:

```bash
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Run the Django server:

```bash
python manage.py runserver
```

The frontend and backend should then be running locally.

## Environment Variables

Create a `.env` file where required and add the API keys used by the application.

Example:

```env
MAP_API_KEY=your_map_api_key
```

Do not commit real API keys to GitHub.

## API Flow

The frontend sends the trip information to the Django backend.

Example request:

```json
{
  "current_location": "Chicago, IL",
  "pickup_location": "Denver, CO",
  "dropoff_location": "Los Angeles, CA",
  "current_cycle_used": 30
}
```

The backend processes the trip and returns the information required by the result page.

The response can include:

```text
Route
Distance
Driving time
Stops
Rest periods
Daily schedule
Daily ELD logs
```

## ELD Logic

The ELD is not manually filled with unrelated data.

The application first creates the trip schedule and then converts the scheduled activities into ELD duty-status periods.

For example:

```text
Driving
   ↓
DRIVING

Fueling
   ↓
ON DUTY (NOT DRIVING)

Rest in sleeper berth
   ↓
SLEEPER BERTH

Personal/off time
   ↓
OFF DUTY
```

This keeps the trip schedule and ELD logs connected.

The daily log follows the 24-hour graph format described in the provided FMCSA Hours of Service guide.

## Testing

The application should be tested with different types of trips, including:

* Short trips
* Long-distance trips
* Trips that require multiple rest periods
* Trips that cross multiple days
* Trips requiring fuel stops
* Different current cycle hours

Particular attention should be given to making sure that the generated schedule and ELD logs stay consistent.

## Deployment

The frontend is hosted online for assessment.

The backend is deployed separately and connected to the frontend through the API.

### Live Application

[Add hosted application URL here]

### GitHub Repository

https://github.com/abdulmalik-codeWithFaith/TruckHOS

### Loom Walkthrough

[Add Loom video URL here]

## Assessment Notes

This project was intentionally kept focused on the requirements of the assessment.

The main priority was to build a working flow from:

```text
Driver Input
→ Route
→ HOS Planning
→ Stops / Rests
→ Daily Schedule
→ ELD Logs
```

The application uses the assumptions provided in the assessment rather than attempting to cover every HOS rule and exception.

## Author

Abdulmalik Abdulrosheed

Full-Stack Developer
