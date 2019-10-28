@browser
Feature: bits and bytes-image upload

  Scenario: A student can upload an image
    Given I am logged in as a student
    And I navigate to the image uploads page
    When I choose a file to upload
    And I submit the file upload
    Then The image is visible on the website