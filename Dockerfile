FROM cypress/browsers:chrome69

# Create container directory to house Project
RUN mkdir squadhealthcheck

# Install Cypress and install the FE code
RUN npm install --save-dev cypress

# Add project files and subdirectories to container directory
ADD . / squadhealthcheck/
WORKDIR /squadhealthcheck/

RUN npm install 

# Start the localhost and run the tests in the container
CMD echo "Running local build and kicking off Cypress tests" && \
npm run dev & $(npm bin)/cypress run --browser chrome