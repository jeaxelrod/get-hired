require 'rails_helper'

RSpec.describe JobApplication, :type => :model do
  
  before(:each) do
    @job_application = FactoryGirl.create(:job_application)
  end

  it "has a valid factory" do
    expect(@job_application).to be_valid
  end

  it "is invalid without belonging to a job" do
    @job_application.job = nil
    expect(@job_application).to_not be_valid
  end

  it "belongs to a job" do
    expect(@job_application.job).to be_valid
  end

  it "belongs to a user" do
    expect(@job_application.user).to be_valid
  end

  it "is invalid without a user" do
    @job_application.user = nil
    expect(@job_application).to_not be_valid
  end

  it "deletes when its job deletes" do
    @job_application = FactoryGirl.create(:job_application)
    job = @job_application.job
    expect(job.job_applications.length).to eq(1)

    Job.destroy(job.id)

    expect(Job.where(id: job.id)).to be_empty 
    expect(JobApplication.where(id: @job_application.id)).to be_empty 
  end
end

