require 'rails_helper'

RSpec.describe User, :type => :model do

  it "has a valid factory" do
    expect(FactoryGirl.create(:user)).to be_valid
  end
    
  it "is invalid without an email" do
    user = FactoryGirl.create(:user)
    user.email = nil
    expect(user).to_not be_valid
  end

  it "is invalid with an proper email" do
    user = FactoryGirl.create(:user)
    user.email = "a.com"
    expect(user).to_not be_valid
  end

  it "is invalid without a proper email" do
    user = FactoryGirl.create(:user)
    user.email = "h@com"
    expect(user).to_not be_valid
  end

  it "is invalid to create new user without password confirmation" do
    expect { FactoryGirl.create(:user, password_confirmation: "") }.to raise_error
  end

  it "only accepts valid emails" do
    expect(FactoryGirl.create(:user, email: "a@h.c")).to be_valid
  end

  it "has many jobs" do
    user = FactoryGirl.create(:user)
    FactoryGirl.create_list(:job, 5, user: user)
    expect(user.jobs.length).to eql(5)
    user.jobs.each do |job|
      expect(job).to be_valid
    end
  end

  it "has many job_applications" do
    user = FactoryGirl.create(:user)
    job = FactoryGirl.create(:job, user: user)
    FactoryGirl.create_list(:job_application, 5, job: job)
    expect(user.job_applications.length).to eql(5)
    user.job_applications.each do |job_application|
      expect(job_application).to be_valid
    end
  end

  it "has many job_queues" do
    user = FactoryGirl.create(:user)
    FactoryGirl.create_list(:job_queue, 5, user: user)
    expect(user.job_queues.length).to eql(5)
    user.job_queues.each do |queue|
      expect(queue).to be_valid
    end
  end
end
