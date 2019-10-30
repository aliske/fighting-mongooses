require_relative '../../../browser_tests/lib/chrome_maker'
# ********************************************************************
# ** Before @browser **
#   Building a Browser object
# ********************************************************************
Before('@browser') do
  $browser = ChromeMaker.build_chrome(BROWSER_OPTIONS)
end

After('@browser') do
  $browser.windows.last.close while $browser.windows.size > 1
end