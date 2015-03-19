require 'rails_helper'

RSpec.describe Job, :type => :model do
  
  before(:each) do
    @job = FactoryGirl.create(:job)
  end

  it "has a valid factory" do
    expect(@job).to be_valid
  end

  it "is invalid without belonging to a user" do
    @job.user = nil
    expect(@job).to_not be_valid
  end

  it "can belong to pendings" do
    job_queue = FactoryGirl.create(:job_queue)
    job = FactoryGirl.create(:job, job_queue: job_queue, user: job_queue.user)
    expect(job.job_queue).to be_valid
  end

  it "belongs to the proper user" do
    expect(@job.user).to be_valid
  end
  
  it "has many job_applications" do
    FactoryGirl.create_list(:job_application, 5, job: @job)
    expect(@job.job_applications.length).to eql(5)
    @job.job_applications.each do |app|
      expect(app).to be_valid
    end
  end

  describe "link" do
    context "valid links" do
      it "should be valid with HTTP" do
        @job.link = "http://m.co"
        expect(@job).to be_valid
      end
      it "should be valid with HTTPS" do
        @job.link = "https://www.c.com"
        expect(@job).to be_valid
      end
    end
    context "invalid links" do
      it "should be invalid without protocol" do
        @job.link = "m.co"
        expect(@job).to_not be_valid
      end

      it "should be invalid without domain name" do
        @job.link = "http://"
        expect(@job).to_not be_valid
      end
    end
  end

end
