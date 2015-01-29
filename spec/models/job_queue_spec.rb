require 'rails_helper'

RSpec.describe JobQueue, :type => :model do

  it "has a valid factory" do
    expect(FactoryGirl.create(:job_queue)).to be_valid
  end

  it "belongs to a user" do
    expect(FactoryGirl.create(:job_queue).user).to be_valid
  end

  it "is invalid without a user" do
    job_queue = FactoryGirl.create(:job_queue)
    job_queue.user = nil
    expect(job_queue).to_not be_valid
  end

  it "has many jobs" do
    job_queue = FactoryGirl.create(:job_queue)
    FactoryGirl.create_list(:job, 5, job_queue: job_queue, user: job_queue.user)
    expect(job_queue.jobs.length).to eql(5)
    job_queue.jobs.each do |job|
      expect(job).to be_valid
    end
  end
end

