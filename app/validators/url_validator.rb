class UrlValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    begin
      uri = URI.parse(value)
      raise URI::InvalidURIError unless uri.kind_of?(URI::HTTP)
    rescue URI::InvalidURIError
      record.errors[attribute] << (options[:message] || "is not a valid url")
    end
  end
end
