class ImageUploadsPage

    def initialize(browser_object: $browser)
      @page_url = URI.join(BASE_URL, '/StaticPages/upload_page.html').to_s

      @browser = browser_object

      @choose_button = @browser.input(id: 'choose_file')
      @submit_button = @browser.input(value: 'Submit')

      @file_field = @browser.file_field(name: 'file')

      yield(self) if block_given?
    end

    def choose_image(image_path)
      @choose_button.set image_path
    end

    def upload_image
      @submit_button.click
    end

    def visit
      @browser.goto(@page_url)
    end
end