class AnnouncementsPage

  attr_accessor :default_message, :default_title, :edited_message, :edited_title
  def initialize(browser_object: $browser)
    @page_url = URI.join(BASE_URL, '/StaticPages/Announcements.html').to_s

    @browser = browser_object

    @title_field = @browser.text_field(id: 'title')
    @message_field = @browser.textarea(id: 'announcement')

    @edit_title_field = @browser.text_field(id: 'edit-title')
    @edit_message_field = @browser.textarea(id: 'edit-announcement')

    @submit_button = @browser.button(id: 'submit-btn')
    @submit_edit_button = @browser.button(id: 'edit-submit-btm')

    @announcements_table_body = @browser.tbody(id: 'announcement-tbody')

    @announcements = @announcements_table_body.trs

    @most_recent_announcement = @announcements.last

    @default_title = 'default title'
    @default_message = 'default message'
    @edited_title = 'edited title'
    @edited_message = 'edited message'

    # @announcements_list = @browser.?

    yield(self) if block_given?
  end

  def fill_form(title: @default_title, message: @default_message)
    @title_field.set title
    @message_field.set message
  end

  def submit_form
    @submit_button.click
  end

  def most_recent_announcement
    parsed_announcement @announcements.last
  end


  def edit_announcement(item: 0, title: @edited_title, message: @edited_message)
    ann = parsed_announcement(@announcements[item])
    ann[:edit].click
    @edit_title_field.set title
    @edit_message_field.set message
  end

  def submit_edit_form
    @submit_edit_button.click
  end

  def delete_announcement(item: 0)
    # @announcements_list[item].delete_button.click
  end


  def parsed_announcement(ann)
    {
      id: ann.tds[0].text,
      title: ann.tds[1].text,
      announcement: ann.tds[2].text,
      timestamp: ann.tds[3].text,
      edit: ann.tds[4].button,
      delete: ann.tds[5].button
    }
  end

  def visit
    @browser.goto(@page_url)
  end

end