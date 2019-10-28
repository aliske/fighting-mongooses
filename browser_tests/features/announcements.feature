@browser
Feature: bits and bytes-announcements

  Scenario: An administrator can create a new announcement
    Given I am logged in as an administrator
    And I navigate to the announcements management page
    When I completely fill out the new announcements form
    And I submit the announcements form
    Then The announcement is visible on the website

  Scenario: An administrator can edit an announcement
    Given I am logged in as an administrator
    And I navigate to the announcements management page
    When I edit the first announcement
    And I submit the announcements form
    Then The announcement is visible on the website

  Scenario: An administrator can delete an announcement
    Given I am logged in as an administrator
    And I navigate to the announcements management page
    When I delete the first announcement
    Then The announcement is not visible on the website

