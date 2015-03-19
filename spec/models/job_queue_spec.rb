require 'rails_helper'

RSpec.describe JobQueue, :type => :model do

  before(:each) do
    @job_queue = FactoryGirl.create(:job_queue)
  end

  it "has a valid factory" do
    expect(@job_queue).to be_valid
  end

  it "belongs to a user" do
    expect(@job_queue.user).to be_valid
  end

  it "is invalid without a user" do
    @job_queue.user = nil
    expect(@job_queue).to_not be_valid
  end

  it "has many jobs" do
    FactoryGirl.create_list(:job, 5, job_queue: @job_queue, user: @job_queue.user)
    expect(@job_queue.jobs.length).to eql(5)
    @job_queue.jobs.each do |job|
      expect(job).to be_valid
    end
  end
end

