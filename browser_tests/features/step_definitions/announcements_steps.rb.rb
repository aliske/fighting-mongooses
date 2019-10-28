require_relative '../../../browser_tests/lib/page_objects/announcements_page'

Given(/^I am logged in as an administrator$/) do
  #no op
end

And(/^I navigate to the announcements management page$/) do
  AnnouncementsPage.new.visit
end

When(/^I completely fill out the new announcements form$/) do
  AnnouncementsPage.new.fill_form
end

And(/^I submit the announcements form$/) do
  AnnouncementsPage.new.submit_form
end

Then(/^The announcement is visible on the website$/) do
  #no op
end

When(/^I edit the first announcement$/) do
  AnnouncementsPage.new.edit_announcement
end

When(/^I delete the first announcement$/) do
  AnnouncementsPage.new.delete_announcement
end

Then(/^The announcement is not visible on the website$/) do
  #no op
end