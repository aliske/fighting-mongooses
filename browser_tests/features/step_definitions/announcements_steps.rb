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

Then(/^The announcement is successfully (?:(created|edited))$/) do |option|
  AnnouncementsPage.new do |page|
    if option == 'created'
      expect($browser.alert.text).to eq 'record inserted successfully'
      message = page.default_message
      title = page.default_title
    else
      expect($browser.alert.text).to eq 'Your edit has been made.'
      message = page.edited_message
      title = page.edited_title
    end
    $browser.alert.close
    ann = page.most_recent_announcement
    aggregate_failures do
      expect(ann[:announcement]).to eq message
      expect(ann[:title]).to eq title
    end
  end
end

When(/^I edit the last announcement$/) do
  AnnouncementsPage.new.edit_announcement
end

When(/^I delete the first announcement$/) do
  AnnouncementsPage.new.delete_announcement
end

Then(/^The announcement is not visible on the website$/) do
  #no op
end

And(/^I submit the edit announcements form$/) do
  AnnouncementsPage.new.submit_form
end