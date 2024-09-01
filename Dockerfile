# This build contains 2 stages.
# First stage consists of seting up the python environment for setup.
# Things like downloading pictures is handled here.

#START STAGE 0.
FROM python:3.11

# Install the requirements for running the python setup script.
COPY setup /opt/setup
WORKDIR /opt/setup
RUN pip install --no-cache-dir -r requirements.txt
# Finally run the setup script.
RUN python setup.py docker

# START STAGE 1.
# Next we use the httpd image for hosting our app.
FROM httpd:alpine
# Copy the images from the python script.
COPY --from=0 /opt/setup/images /usr/local/apache2/htdocs/images
COPY --from=0 /opt/setup/locations.json /usr/local/apache2/htdocs/locations.json
COPY --from=0 /opt/setup/locations.csv /usr/local/apache2/htdocs/locations.csv

# Copy our public documents together with our httpd config.
COPY public/* /usr/local/apache2/htdocs
COPY httpd.conf /usr/local/apache2/conf/httpd.conf
