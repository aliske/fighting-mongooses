require_relative '../../../browser_tests/lib/page_objects/image_uploads_page'

Given(/^I am logged in as a student$/) do
  #no op
end

And(/^I navigate to the image uploads page$/) do
  ImageUploadsPage.new.visit
end

When(/^I choose a file to upload$/) do
  ImageUploadsPage.new.choose_image('/users/cheard/fightingmongooses/fighting-mongooses/browser_tests/lib/forms/Photo_Release_Form.pdf')
  x = 'x'
end

Then(/^I can preview the file$/) do
  ImageUploadsPage.new do |page|
    page.preview_image
    expect(page.preview_viewer).to exist
    sleep 5
  end
end

And(/^I submit the file upload$/) do
  ImageUploadsPage.new.upload_image
end

Then(/^The image is visible on the website$/) do
  #no op
end