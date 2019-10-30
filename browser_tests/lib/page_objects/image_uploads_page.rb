class ImageUploadsPage

    attr_accessor :preview_viewer

    def initialize(browser_object: $browser)
      @page_url = URI.join(BASE_URL, '/StaticPages/upload_page.html').to_s

      @browser = browser_object

      @choose_button = @browser.file_field
      @submit_button = @browser.button(id: 'file_submit_btn')

      @preview_button = @browser.button(id: 'preview_btn')
      @preview_viewer = @browser.div(id: 'content')

      @file_field = @browser.file_field(name: 'file')

      yield(self) if block_given?
    end

    def choose_image(image_path)
      @choose_button.set image_path
      x = 'x'
    end

    def upload_image
      @submit_button.click
    end

    def preview_image
      @preview_button.click
    end

    def visit
      @browser.goto(@page_url)
    end
end