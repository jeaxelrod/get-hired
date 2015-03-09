FactoryGirl.define do
  factory :job_application do
    date_applied DateTime.now
    sequence(:communication) { |n| "Communication with #{n}" }
    sequence(:comments) { |n| "Comment #{n}" }
    status "Applied"
    job
    before(:create) do |application|
      application.user = application.job.user
    end
  end
end
