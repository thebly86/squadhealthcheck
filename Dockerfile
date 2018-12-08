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
npm run dev & $(npm bin)/cypress run --browser chrome --spec 'cypress/integration/e2e/*'
# Run tests specifying a glob of where to look for test files (Note: quotes required):
# cypress run --spec 'cypress/integration/login/**/*' this runs everything in ** folder and/* is everything inside directory
# cypress run --spec 'cypress/integration/login/* will only run tests in that folder and not the sub folders that follow it