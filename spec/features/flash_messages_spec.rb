require 'rails_helper'

RSpec.feature "Flash Message", :type => :feature, js: true do
  include Warden::Test::Helpers
  Warden.test_mode!

  scenario "Flash disappears a page after it appears" do
    user = FactoryGirl.create(:user)
    login_as(user, :scope => :user)

    visit root_path
    click_link "Log Out"
    expect(page).to have_text("Successful")

    click_link "Sign In"
    expect(page).to_not have_text("Successful")
  end
end



    
