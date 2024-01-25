We use cypress for both component and ui testings.

For conponent testing, we write additional 6 components which are 'Block.jsx', 'Btn.jsx', 'Filter.jsx', 'GetBedroomDetail.jsx', 'Review.jsx', and 'loginForm.jsx'. The cypress tests are written in the correspoding '.cy.jsx' files.

For another UI testing other than happy path, we aims to check some errors during the usage. It can be concluded as:
1. register without entering all inputs, go to error page.
2. back to register and successfully register an account, enter landing page.
3. go to hosted listings page, click create listing and enter craete listing page
4. submit without filling in all inputs, go to error page.
5. back to create and successfullt create a listing.
6. publish the listing without filling in correst dates, go to error page.
7. back to publish and successfullt publish the listing
8. logout and go to log in page
9. log in a user with wrong password, go to error page
10. back to log in page, enter correect info and successfully log in
11. log out.
The happy path and this error path file is located in frontend/cypress/e2e folder.

When running npm run test, it goes to the cypress website and we encounter a problem with Chrome, and can only use Electron to run the test.