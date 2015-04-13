require 'rails_helper'

RSpec.feature "Contacts", :type => :feature, js: true do
  include Warden::Test::Helpers
  Warden.test_mode!

  scenario "Index page displays contact info" do
    contact = FactoryGirl.create(:contact)
    job = contact.job
    user = contact.user
    login_as(user, :scope => :user)

    visit root_path
    click_link "Contacts"

    expect(page).to have_content(contact.first_name)
    expect(page).to have_content(contact.last_name)
    expect(page).to have_content(contact.phone_number)
    expect(page).to have_content(contact.email)
    expect(page).to have_content(job.company)
  end
end
