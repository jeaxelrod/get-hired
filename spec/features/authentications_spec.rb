require 'rails_helper'

RSpec.feature "Authentications", :type => :feature, js: true do
  include Warden::Test::Helpers
  Warden.test_mode!

  scenario "User logs in successfully" do
    user = FactoryGirl.create(:user) 

    visit root_path
    click_on "Sign In"

    fill_in "Email",    with: user.email 
    fill_in "Password", with: user.password 
    click_button "Sign In"

    expect(current_url).to_not match(/login/) 
    expect(page).to have_text("Successful")
    expect(page).to_not have_link("Sign In")
  end

  scenario "User is logged in from a saved session beforehand" do
    user = FactoryGirl.create(:user)
    login_as(user, :scope => :user)

    visit root_path

    expect(page).to have_link("Log Out")
  end

  scenario "User logs in with wrong information" do
    FactoryGirl.create(:user)

    visit root_path
    click_on "Sign In"

    fill_in "Email",    with: "johndoe@gmail.com"
    fill_in "Password", with: "password"
    click_button "Sign In"

    expect(current_url).to match(/login/)
    expect(page).to have_text("Invalid")
    expect(page).to have_link("Sign In")
  end

  scenario "User logs in and out successfully" do
    user = FactoryGirl.create(:user)
    
    visit root_path
    click_on "Sign In"

    fill_in "Email",    with: user.email 
    fill_in "Password", with: user.password 
    click_button "Sign In"
    click_link "Log Out"

    expect(page).to have_link("Sign In")
    expect(page).to have_text("Successful")
  end
end

