class AnnouncementsPage

  def initialize(browser_object: $browser)
    @page_url = URI.join(BASE_URL, '/StaticPages/Announcements.html').to_s

    @browser = browser_object

    @message_field = @browser.textarea(id: 'message_field')
    @submit_button = @browser.input(value: 'Submit')

    # @announcements_list = @browser.?

    yield(self) if block_given?
  end

  def fill_form(title: 'default title', message: 'default message')
    @message_field.set message
  end

  def submit_form
    @submit_button.click
  end

  def edit_announcement(item: 0, message: 'EDIT EDIT EDIT')
    # @announcements_list[item].edit_button.click
    # fill_form(message: message)
  end

  def delete_announcement(item: 0)
    # @announcements_list[item].delete_button.click
  end

  def visit
    @browser.goto(@page_url)
  end

end