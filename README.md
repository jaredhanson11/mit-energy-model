# MIT Energy Model

Website: <https://web-cert.mit.edu/campusenergymodel/www/>

An interactive web app for users to access and process simulation results from the MIT campus model developed by the Course 4 Department.

## Local Setup

### Server

You'll probably want to install all the `requirements.txt` in a virtualenv. If `pg_config` executable not found, then you'll need to install PostgreSQL and add the bin to PATH. See <https://stackoverflow.com/questions/26717436/pg-config-executable-not-found-when-using-pgxnclient-on-windows-7-x64>.

Running run.py should start the Flask server.

Not sure how integration between server and client works yet.

### Client

Use `npx webpack` under client to generate bundle, which should setup index.html to be used as the entry point to the website. `npx webpack --watch` compiles changed code on the spot, and is good for development.

### Server

The server can be run using gunicorn on Linux distributions, as well as waitress on Windows. Under waitress, start the server with the following commands:

    cd server
    waitress-serve --port=8000 server:app

### Database

See `db-connect.bat` for an executable/credentials for connecting. The password is `I78ZQ10`.

`\dt` doesn't show all the tables. The relevant tables are:

* `sustain.pi_stm`
* `sustain.pi_elec`
* `sustain.pi_chw`

## Remote Setup

### AWS

To manage the AWS instance (ie. checking the IP address, turning the instance
on/off, spinning up new instances) visit the AWS console.

    console.aws.amazon.com/console/home

    Username: sustainable_design_lab_aws@mit.edu
    Password: SDL@2017

### Access

There is one user on the server that has full sudo access.

    Username: sdl
    Password: SDL@2017

To log into the server via ssh run the command

    $ ssh sdl@52.11.126.32

There is no password required for ssh access to the server, but you must have
your ssh-key (ie. ~/.ssh/id_rsa.pub) as an authorized user on the server. To
give a new computer ssh access to the server, edit the file on the server at
/home/sdl/.ssh/authorized_keys, and add a new line with the user's id_rsa.pub
contents.

## Additional Links

* I'm not really sure what this is: <https://docs.google.com/spreadsheets/d/1eGXjn9asQPbWnCO5T6WDdJWYGP_QLKxdDDpCAPJLON0/edit#gid=0>

## Other (Jared's Notes)

The following sections are notes from Jared on running the server.

### Intro

The energyplus ec2 instance is responsible for running the webserver that
powers the CampusEnergyModel website. This document will guide you through how
the server is structured and some useful different commands that will help get
the server running.

### Directory Structure

Find the source code to the CampusEnergyModel project in our server at the file
location: /home/sdl/CampusEnergyModel/mit-energy-model/ or if you're logged in as the sdl user:
~/CampusEnergyModel/mit-energy-model/

The server related code is found at ~/CampusEnergyModel/mit-energy-model/server/
This directory contains code related to converting Hobolink data to EPW data
inside the ~/CampusEnergyModel/mit-energy-model/server/hobolink/ directory and
EPW files to be used for simulations the the ~/.../server/EPW/ folder. The
source code for the actual Flask web server is located at:
~/CampusEnergyModel/mit-energy-model/server/server/.

Please make sure to note that the folder ~/.../server/hobolink/HobolinkParser/
is deprecated and not used anymore. Don't worry about it because
~/.../server/HobolinkToEPW/ was added to replace HobolinkParser. You will
only ever need to interact with the HobolinkToEPW package.


### Starting the Server

The API is built with Flask. To run the CampusEnergyModel server we use
gunicorn. Use these commands to start the server.

    $ cd /home/sdl/CampusEnergyModel/imit-energy-model/server/
        # change to server directory
    $ . ./venv/bin/activate
        # start the virtualenvironment
    $ gunicorn server:server -b 127.0.0.1:8000 -w 3 -d --access-logfile <path-to-access-logfile> --error-logfile <path-to-error-logfile>
        # gunicorn server:server | start server object defined in server.py
        # -b 127.0.0.1:8000 | binds the server to localhost port 8000
        # -w 3 | allocates 3 workers to serve requests
        # -d | run server as daemon process
        # --error-logfile, --access-logfile | writes logs to file, choose your
        #       own location to keep your logfiles


### Restarting the server

Since we run gunicorn as a daemon process, when we want to restart the server
we first need to kill the existing server's process before we can rerun the
startup commands above.

    $ ps -x | grep gunicorn
        # will print all processes running with gunicorn in them
        # find the process id associated with the command that is running the
        daemon process
    $ kill <process_id> # might need sudo or the command 'pkill'
    $ ps -x | grep gunicorn
        # make sure all gunicorn processes using localhost:8000 are stopped
    $ gunicorn server:server -b 127.0.0.1:8000 -w 3 -d ....
        # rerun the commands found above to start the server


### NGINX Proxy

We use Nginx to sit in front of our gunicorn process and reverse proxy all api
requests to localhost:8000 where our server is being hosted locally. In order
to allow Nginx to reverse proxy all api traffic nginx requires configuration
files defining the proxy rules. The relevant configuration profile is found at
/etc/nginx/default.d/CampusEnergyModel.conf. The relevant rule is

    location /CampusEnergyModel/api/ {
      proxy_pass http://127.0.0.1:8000/;
    }

which proxies all requests at /CampusEnergyModel/api to localhost:8000.

Nginx should always be running even if the gunicorn process isn't. The only
time you should have to interact with Nginx is if you need to change some proxy
rules and restart the Nginx process to apply the changes. To restart run:

    $ nginx -s reload

or

    $ nginx -s stop
        # stop
    $ nginx
        # start

You most likely will have to run those commands as sudo to prevent permission
errors.

Tip: Use ps -ax | grep nginx to determine whether nginx is currently running or
stopped.


### Hobolink Weather Data

Everyday we are delivered weather data from a service called Hobolink. That
data is set to be copied into our server via ftp protocol into the directory
/srv/ftp/. To keep our weather database updated, we run a cronjob twice daily
to update the database with the newly delivered weather data.

Run the command

    $ crontab -e # Edit the cronjobs
        # If you see, 'Sorry, this command is not available...' Just press
        #    enter and ignore the errors

Read through the crontab file and you'll see two different scripts that we run
(each twice a day) that add new weather data to the database on our server,
and additionally create an updated EPW weather file. Script file locations are
found within the crontab.

I mentioned the daily ftp is already set up within Hobolink, but should you
ever need to change the delivery options of the Hobolink weather data then
visit their site. The log in information is below.

    hobolink.com

    Username: MITurbanmicroclimate
    Password: Optimization
