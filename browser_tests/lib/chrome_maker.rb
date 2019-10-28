module ChromeMaker
  require 'watir'
  require 'selenium-webdriver'

  attr_accessor :chrome_options

  def self.build_chrome(opts)
    @chrome_options = Selenium::WebDriver::Chrome::Options.new

    @chrome_options.add_argument('ignore-certificate-errors')
    @chrome_options.add_argument('--no-sandbox')
    @chrome_options.add_argument('--disable-setuid-sandbox')

    # Proxy handling
    chrome_proxy(opts[:proxy])

    # Custom user agent handling
    chrome_user_agent(opts[:user_agent])

    # Custom download directory
    # Default save to disk behavior
    chrome_downloads(opts[:download_dir])

    # Don't accept cookies (simulating crawler browsers, for example)
    chrome_block_cookies(opts[:block_cookies])

    chrome_w3c_status(opts[:w3c])

    Watir::Browser.new :chrome, options: @chrome_options

  end

  def self.chrome_proxy(proxy)
    if proxy.is_a? Selenium::WebDriver::Proxy
      @chrome_options.add_argument("proxy-server=#{proxy.http}")
    else
      @chrome_options.add_argument("proxy-server=#{proxy}")
    end
  end

  def self.chrome_user_agent(user_agent)
    unless user_agent.nil?
      @chrome_options.add_argument("user-agent=#{user_agent}")
    end
  end

  def self.chrome_downloads(download_dir)
    unless download_dir.nil?
      download_prefs = {
        prompt_for_download: false,
        default_directory: download_dir
      }
      chrome_update_pref(:download, download_prefs)
      profile_prefs = {
        default_content_setting_values: {automatic_downloads: 1}
      }
      chrome_update_pref(:profile, profile_prefs)
    end
  end

  def self.chrome_block_cookies(block_cookies)
    if block_cookies
      profile_prefs = {
        default_content_setting_values: {cookies: 2}
      }
      chrome_update_pref(:profile, profile_prefs)
    end
  end

  def self.chrome_w3c_status(w3c)
    if w3c.nil?
      @chrome_options.add_option('w3c', false)
    else
      @chrome_options.add_option('w3c', w3c)
    end
  end

  def self.chrome_update_pref(pref_type, new_prefs)
    chrome_pref = @chrome_options.prefs.fetch(pref_type, {})
    chrome_pref.each_key do |key|
      chrome_pref[key].merge!(new_prefs.delete(key))
    end
    @chrome_options.add_preference(pref_type, chrome_pref.merge(new_prefs))
  end

end