FROM cypress/browsers:chrome67

# Create container directory to house Project
RUN mkdir squadhealthcheck

# Set log level for npm to warn, to prevent excessive logging from Cypress
RUN npm config set loglevel warn
ENV CI=true

# Add project files and subdirectories to container directory
ADD . / squadhealthcheck/
WORKDIR /squadhealthcheck/

RUN rm -rf node_modules/
RUN rm -rf src/api/firebase-service.js
RUN cp cypress/support/firebase-service.js src/api/firebase-service.js

CMD echo "E2E tests have been disabled temporarily."

# Install Dependencies
# RUN npm install

# Start the localhost and run the tests in the container
# CMD echo "Running local build and kicking off Cypress tests" && \
# npm run firebase & \
# npm run dev & \
# $(npm bin)/cypress run --browser chrome --spec 'cypress/integration/e2e/*'
# Run tests specifying a glob of where to look for test files (Note: quotes required):
# cypress run --spec 'cypress/integration/login/**/*' this runs everything in ** folder and/* is everything inside directory
# cypress run --spec 'cypress/integration/login/* will only run tests in that folder and not the sub folders that follow it
