require 'rails_helper'

RSpec.describe JobApplication, :type => :model do

  it "has a valid factory" do
    expect(FactoryGirl.create(:job_application)).to be_valid
  end

  it "is invalid without belonging to a job" do
    job_application = FactoryGirl.create(:job_application)
    job_application.job = nil
    expect(job_application).to_not be_valid
  end

  it "belongs to a job" do
    expect(FactoryGirl.create(:job_application).job).to be_valid
  end

  it "belongs to a user" do
    job_application = FactoryGirl.create(:job_application)
    expect(job_application.user).to be_valid
  end

  it "is invalid without a user" do
    app = FactoryGirl.create(:job_application)
    app.user = nil
    expect(app).to_not be_valid
  end
end

