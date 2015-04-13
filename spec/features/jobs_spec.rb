require 'rails_helper'

RSpec.feature "Jobs", :type => :feature, js: true do
  include Warden::Test::Helpers
  Warden.test_mode!

  scenario "Index page displays job, job_application, and contacts info" do
    contact = FactoryGirl.create(:contact)
    app = contact.job_application
    user = contact.user 
    job  = contact.job
    login_as(user, :scope => :user)

    visit root_path
    click_link "Jobs"

    expect(page).to have_content(job.position)
    expect(page).to have_content(job.company)
    expect(page).to have_link(job.link.split("http://")[1])
    expect(page).to have_content(app.status)
    expect(page).to have_content(contact.first_name)
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
  
  scenario "Creating new job, job application, and contact" do
    user = FactoryGirl.create(:user)
    login_as(user, :scope => :user)
    new_job = { position: "Internship",
                company:  "Facebook",
                link:     "http://facebook.com" }
    new_app = { comments:      "Laurem ipsum",
                status:        "Applied" }
    new_contact = { first_name:   "First",
                    last_name:    "Last",
                    email:        "first.last@email.com",
                    phone_number: 1234567890 }
    visit root_path
    click_link "Jobs"

    click_button "New Job"
    click_button "Apply"

    fill_in "Position",     with: new_job[:position] 
    fill_in "Company",      with: new_job[:company] 
    fill_in "Link",         with: new_job[:link] 
    fill_in "First Name",   with: new_contact[:first_name]
    fill_in "Last Name",    with: new_contact[:last_name]
    fill_in "Email",        with: new_contact[:email]
    fill_in "Phone Number", with: new_contact[:phone_number]
    fill_in "Comments",     with: new_app[:comments]
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

    expect(page).to have_content new_contact[:first_name]
    expect(page).to have_content new_contact[:last_name]
    expect(page).to have_content new_contact[:email]
    expect(page).to have_content new_contact[:phone_number]
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

  scenario "Failing to create a new job, app, and contact" do
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

  scenario "Editing a Job, Job Application, and Contact" do
    contact = FactoryGirl.create(:contact)
    user = contact.user
    job  = contact.job
    app  = contact.job_application 
    login_as(user, :scope => :user)

    visit root_path
    click_link "Jobs"

    click_button "Edit"
    expect(page).to have_field("Link")
    expect(page).to have_field("First Name")
    expect(page).to have_field("Comments")

    fill_in "Position",  with: "Cat Sitter"
    fill_in "Comments",  with: "3 Baby kitties"
    fill_in "Last Name", with: "Meow"
    click_button "Edit Job"

    expect(page).to_not have_field("Link")
    expect(page).to_not have_field("Communication")
    expect(page).to have_content("Cat Sitter")
    expect(page).to have_content("3 Baby kitties")
    expect(page).to have_content("Meow")
  end

  scenario "Adding a contact to a job without a contact" do
    app = FactoryGirl.create(:job_application)
    job = app.job
    user = job.user
    login_as(user, :scope => :user)

    visit root_path
    click_link "Jobs"
    click_button "Edit"
    fill_in "First Name", with: "First Name"
    click_button "Edit Job"

    expect(page).to have_content("First Name")
    expect(user.contacts.length).to eq(1)
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

