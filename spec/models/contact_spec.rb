require 'rails_helper'

RSpec.describe Contact, type: :model do
  
  it "has a valid factory" do
    expect(FactoryGirl.create(:contact)).to be_valid
  end
  it "belongs to a user" do
    contact = FactoryGirl.create(:contact)

    expect(contact.user).to be_valid
  end
  it "belongs to a job" do
    contact = FactoryGirl.create(:contact)

    expect(contact.job).to be_valid
  end

  it "belongs to a job application" do
    contact = FactoryGirl.create(:contact)

    expect(contact.job_application).to be_valid
  end
  it "validates emails"
  it "validates phone numbers"
end
