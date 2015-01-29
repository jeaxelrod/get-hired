FactoryGirl.define do
  factory :job_application do
    date_applied DateTime.now
    job
    before(:create) do |application|
      application.user = application.job.user
    end
  end
end
