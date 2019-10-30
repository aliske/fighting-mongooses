@browser
Feature: bits and bytes-announcements

  Scenario: An administrator can create a new announcement
    Given I am logged in as an administrator
    And I navigate to the announcements management page
    When I completely fill out the new announcements form
    And I submit the announcements form
    Then The announcement is successfully created

  Scenario: An administrator can edit an announcement
    Given I am logged in as an administrator
    And I navigate to the announcements management page
    When I edit the last announcement
    And I submit the edit announcements form
    Then The announcement is successfully edited

  Scenario: An administrator can delete an announcement
    Given I am logged in as an administrator
    And I navigate to the announcements management page
    When I delete the first announcement
    Then The announcement is not visible on the website

