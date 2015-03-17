require 'rails_helper'

RSpec.feature "Jobs", :type => :feature, js: true do
  include Warden::Test::Helpers
  Warden.test_mode!

  scenario "Index page displays job info" do
    user = FactoryGirl.create(:user)
    job  = FactoryGirl.create(:job, user: user)
    login_as(user, :scope => :user)

    visit root_path
    click_link "Jobs"

    expect(page).to have_content(job.position)
    expect(page).to have_content(job.company)
    expect(page).to have_link(job.link.split("http://")[1])
  end

  scenario "Creating new jobs" do
    user = FactoryGirl.create(:user)
    login_as(user, :scope => :user)
    new_job = { position: "Internship",
                company:  "Facebook",
                link:     "http://facebook.com" }
    visit root_path

    click_link "Jobs"

    click_button "New Job"
    fill_in "Position", with: new_job[:position]
    fill_in "Company",  with: new_job[:company]
    fill_in "Link",     with: new_job[:link]
    click_button "Create Job"

    expect(user.jobs.length).to eq(1)
    expect(page).to have_content new_job[:position] 
    expect(page).to have_content new_job[:company] 
    expect(page).to have_link "facebook.com"
  end
  
  scenario "Creating new job and job application" do
    user = FactoryGirl.create(:user)
    login_as(user, :scope => :user)
    new_job = { position: "Internship",
                company:  "Facebook",
                link:     "http://facebook.com" }
    new_app = { communication: "Some person",
                comments:      "Laurem ipsum",
                status:        "Applied" }

    visit root_path
    click_link "Jobs"

    click_button "New Job"
    click_button "Apply"

    fill_in "Position", with: "Internship"
    fill_in "Company", with: "Facebook"
    fill_in "Link", with: "http://facebook.com"
    page.find("input.hasDatepicker").click
    page.find(".ui-datepicker-today").click
    fill_in "Communication", with: new_app[:communication]
    fill_in "Comments",      with: new_app[:comments]
    click_button "Create Job"

    expect(user.jobs.length).to eq(1)
    expect(page).to have_content new_job[:position] 
    expect(page).to have_content new_job[:company] 
    expect(page).to have_link "facebook.com"

    expect(user.job_applications.length).to eq(1)
    expect(page).to have_content Date.today.strftime("%-m/%-d/%Y") 
    expect(page).to have_content new_app[:communication] 
    expect(page).to have_content new_app[:comments]
    expect(page).to have_content new_app[:status]
  end

  scenario "Failing to create a new job" do
    user = FactoryGirl.create(:user)
    login_as(user, :scope => :user)

    visit root_path
    click_link "Jobs"

    click_button "New Job"
    fill_in "Link", with: "facebookcom"
    click_button "Create Job"

    expect(page).to have_content "Invalid"
    expect(page).to have_field "Company"
  end

  scenario "Failing ot create a new job and app" do
    user = FactoryGirl.create(:user)
    login_as(user, :scope => :user)

    visit root_path
    click_link "Jobs"

    click_button "New Job"
    click_button "Apply"
    fill_in "Link", with: "facebookcom"
    click_button "Create Job"

    expect(page).to have_content "Invalid"
    expect(page).to have_field "Company"
  end

  scenario "Canceling a request to create a new job"  do
    user = FactoryGirl.create(:user)
    login_as(user, :scope => :user)

    visit root_path
    click_link "Jobs"

    click_button "New Job"
    expect(page).to have_field "Link"

    page.find(".glyphicon-remove").click
    expect(page).to_not have_field "Link"
  end

  scenario "Editing a job" do
    user = FactoryGirl.create(:user)
    job  = FactoryGirl.create(:job, user: user)
    login_as(user, :scope => :user)

    visit root_path
    click_link "Jobs"
    
    click_button "Edit"
    expect(page).to have_field("Link")

    fill_in "Position", with: "Cat Sitter"
    click_button "Edit Job"

    expect(page).to_not have_field("Link")
    expect(page).to have_content("Cat Sitter")
  end

  scenario "Editing a Job and Job Application" do
    user = FactoryGirl.create(:user)
    job  = FactoryGirl.create(:job, user: user)
    app  = FactoryGirl.create(:job_application, job: job, user: user)
    login_as(user, :scope => :user)

    visit root_path
    click_link "Jobs"

    click_button "Edit"
    expect(page).to have_field("Link")
    expect(page).to have_field("Communication")

    fill_in "Position", with: "Cat Sitter"
    fill_in "Comments", with: "3 Baby kitties"
    click_button "Edit Job"

    expect(page).to_not have_field("Link")
    expect(page).to_not have_field("Communication")
    expect(page).to have_content("Cat Sitter")
    expect(page).to have_content("3 Baby kitties")
  end

  scenario "Canceling an edit jobs request" do
    user = FactoryGirl.create(:user)
    job = FactoryGirl.create(:job, user: user)
    login_as(user, :scope => :user)

    visit root_path
    click_link "Jobs"

    click_button "Edit"
    fill_in "Company", with: "meow"

    page.find(".glyphicon-remove").click
    expect(page).to_not have_field("Company")
    expect(page).to_not have_content("meow")
  end

  scenario "Failing to edit a job" do
    user = FactoryGirl.create(:user)
    job  = FactoryGirl.create(:job, user: user)
    login_as(user, :scope => :user)

    visit root_path
    click_link "Jobs"

    click_button "Edit"
    fill_in "Link", with: "catsitter"
    click_button "Edit Job"

    expect(page).to have_field("Link")
    expect(page).to have_content("Invalid")
  end

  scenario "Deleting a job" do
    user = FactoryGirl.create(:user)
    job  = FactoryGirl.create(:job, user: user)
    login_as(user, :scope => :user)

    visit root_path
    click_link "Jobs"
    expect(page).to have_content(job.position)

    click_button "Delete"
    # Test cancel button
    click_button "Cancel"

    click_button "Delete"
    # Confirmation modal appears"
    click_button "Delete Job"

    expect(page).to_not have_content(job.position)
  end
end

