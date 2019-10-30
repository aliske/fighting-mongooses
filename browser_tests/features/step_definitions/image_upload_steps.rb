require_relative '../../../browser_tests/lib/page_objects/image_uploads_page'

Given(/^I am logged in as a student$/) do
  #no op
end

And(/^I navigate to the image uploads page$/) do
  ImageUploadsPage.new.visit
end

When(/^I choose a file to upload$/) do
  ImageUploadsPage.new.choose_image('/some/real/path')
end

And(/^I submit the file upload$/) do
  ImageUploadsPage.new.upload_image
end

Then(/^The image is visible on the website$/) do
  #no op
end