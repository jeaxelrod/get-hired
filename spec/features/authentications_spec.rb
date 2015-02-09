require 'rails_helper'

RSpec.feature "Authentications", :type => :feature, js: true do
  scenario "User logs in successfully" do
    FactoryGirl.create(:user) 

    visit root_path
    click_on "Sign In"

    fill_in "Email",    with: "john.doe@gmail.com"
    fill_in "Password", with: "password"
    click_button "Sign In"

    expect(current_url).to_not match(/login/) 
    expect(page).to have_text("Successful")
    expect(page).to_not have_link("Sign In")
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
end

