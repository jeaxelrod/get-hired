require 'rails_helper'

RSpec.feature "Job Applications", :type => :feature, js: true do
  include Warden::Test::Helpers
  Warden.test_mode!

  scenario "Index page display job applications" do
    user = FactoryGirl.create(:user)
    job = FactoryGirl.create(:job, user: user)
    app = FactoryGirl.create(:job_application, job: job, user: user)
    login_as(user, :scope => :user)

    visit root_path
    click_link "Jobs"

    expect(page).to have_content app.date_applied.strftime("%-m/%-d/%Y") 
    expect(page).to have_content app[:communication] 
    expect(page).to have_content app[:comments]
    expect(page).to have_content app[:status]
  end

  scenario "Create new job application" do
    user = FactoryGirl.create(:user)
    job = FactoryGirl.create(:job, user: user)
    login_as(user, :scope => :user)
    new_app = { communication: "Some person",
                comments:      "Laurem ipsum",
                status:        "Applied" }

    visit root_path
    click_link "Jobs"
    click_button "Apply"

    page.find("input.hasDatepicker").click
    page.find(".ui-datepicker-today").click
    fill_in "Communication", with: new_app[:communication]
    fill_in "Comments",      with: new_app[:comments]
    click_button "Create Application"

    expect(user.job_applications.length).to eq(1)
    expect(page).to have_content Date.today.strftime("%-m/%-d/%Y") 
    expect(page).to have_content new_app[:communication] 
    expect(page).to have_content new_app[:comments]
    expect(page).to have_content new_app[:status]
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
