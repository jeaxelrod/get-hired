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

  it "accepts valid emails" do
    contact = FactoryGirl.create(:contact, email: "a@m.co")
    expect(contact).to be_valid
  end

  it "is valid without an email" do
    contact = FactoryGirl.create(:contact, email: "")
    expect(contact).to be_valid
  end

  it "is invalid without a proper email" do
    contact = FactoryGirl.create(:contact)
    contact.email = "a.com"
    expect(contact).to_not be_valid
  end

  it "is invalid without a propeer email" do
    contact = FactoryGirl.create(:contact)
    contact.email = "h@com"
    expect(contact).to_not be_valid
  end
end
