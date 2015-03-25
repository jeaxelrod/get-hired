require 'rails_helper'

RSpec.feature "Job Applications", :type => :feature, js: true do
  include Warden::Test::Helpers
  Warden.test_mode!

  scenario "Create new job application" do
    user = FactoryGirl.create(:user)
    job = FactoryGirl.create(:job, user: user)
    login_as(user, :scope => :user)
    new_app = { communication: "Some person",
                comments:      "Laurem ipsum",
                status:        "Applied" }
    new_contact = { first_name: "First" }

    visit root_path
    click_link "Jobs"
    click_button "Apply"

    fill_in "Comments",      with: new_app[:comments]
    fill_in "First Name",    with: new_contact[:first_name]
    click_button "Create Application"

    expect(user.job_applications.length).to eq(1)
    expect(page).to have_content Date.today.strftime("%-m/%-d/%Y") 
    expect(page).to have_content new_app[:comments]
    expect(page).to have_content new_app[:status]
    expect(page).to have_content new_contact[:first_name]
  end

  scenario "Canceling a request to create a new job applications" do
    user = FactoryGirl.create(:user)
    job = FactoryGirl.create(:job, user: user)
    login_as(user, :scope => :user)

    visit root_path
    click_link "Jobs"

    click_button "Apply"
    expect(page).to have_field "Date Applied"

    page.find(".glyphicon-remove").click
    expect(page).to_not have_field "Date Applied"
  end

end
