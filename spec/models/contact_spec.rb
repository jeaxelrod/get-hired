require 'rails_helper'

RSpec.describe Contact, type: :model do
  before(:each) do
    @contact = FactoryGirl.create(:contact)
  end

  it "has a valid factory" do
    expect(@contact).to be_valid
  end

  it "belongs to a user" do
    expect(@contact.user).to be_valid
  end

  it "belongs to a job" do
    expect(@contact.job).to be_valid
  end

  it "belongs to a job application" do
    expect(@contact.job_application).to be_valid
  end

  it "accepts valid emails" do
    expect(@contact).to be_valid
  end

  it "is valid without an email" do
    expect(@contact).to be_valid
  end

  it "is invalid without a proper email" do
    @contact.email = "a.com"
    expect(@contact).to_not be_valid
  end

  it "is invalid without a propeer email" do
    @contact.email = "h@com"
    expect(@contact).to_not be_valid
  end
end
