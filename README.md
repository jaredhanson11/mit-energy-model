# MIT Energy Model

Website: <https://web-cert.mit.edu/campusenergymodel/www/>

An interactive web app for users to access and process simulation results from the MIT campus model developed by the Course 4 Department.

## Installation and Setup

### Server

You'll probably want to install all the `requirements.txt` in a virtualenv. If `pg_config` executable not found, then you'll need to install PostgreSQL and add the bin to PATH. See <https://stackoverflow.com/questions/26717436/pg-config-executable-not-found-when-using-pgxnclient-on-windows-7-x64>.

Running run.py should start the Flask server.

Not sure how integration between server and client works yet.

### Client

Use `npx webpack` under client to generate bundle, which should setup index.html to be used as the entry point to the website.

### Database

See `db-connect.bat` for an executable/credentials for connecting. The password is `I78ZQ10`.

`\dt` doesn't show all the tables. The relevant tables are:

* `sustain.pi_stm`
* `sustain.pi_elec`
* `sustain.pi_chw`

## Additional Links

* I'm not really sure what this is: <https://docs.google.com/spreadsheets/d/1eGXjn9asQPbWnCO5T6WDdJWYGP_QLKxdDDpCAPJLON0/edit#gid=0>