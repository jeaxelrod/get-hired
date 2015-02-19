require 'rails_helper'

RSpec.feature "Navbar", :type => :feature, js: true do
  scenario "highlights active links" do
    visit root_path
    click_link "Sign In"
    
    within(".active") { expect(page).to have_content("Sign In") }
    
    click_link "Sign Up"
    within(".active") { expect(page).to have_content("Sign Up") }
  end
end
