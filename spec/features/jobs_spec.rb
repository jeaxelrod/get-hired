require 'rails_helper'

RSpec.feature "Jobs", :type => :feature, js: true do
  include Warden::Test::Helpers
  Warden.test_mode!

  scenario "Index page displays job info" do
    user = FactoryGirl.create(:user)
    job = FactoryGirl.create(:job, user: user)
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

    visit root_path
    click_link "Jobs"

    click_button "New Job"
    fill_in "Position", with: "Internship"
    fill_in "Company", with: "Facebook"
    fill_in "Link", with: "http://facebook.com"
    click_button "Create Job"

    expect(user.jobs.length).to eq(1)
    expect(page).to have_content "Internship"
    expect(page).to have_content "Facebook"
    expect(page).to have_link "facebook.com"
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
    job = FactoryGirl.create(:job, user: user)
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
    job = FactoryGirl.create(:job, user: user)
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
    job = FactoryGirl.create(:job, user: user)
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

