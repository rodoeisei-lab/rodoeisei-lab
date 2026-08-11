#!/usr/bin/env ruby

require "date"
require "yaml"

data_path = File.expand_path("../../_data/navigator_answers.yml", __dir__)
library_path = File.expand_path("../../_data/content_library.yml", __dir__)
site_dir = File.expand_path("../../_site", __dir__)
answers = YAML.safe_load(File.read(data_path, encoding: "UTF-8"), permitted_classes: [Date])
content_library = YAML.safe_load(File.read(library_path, encoding: "UTF-8"), permitted_classes: [Date]) || []
content_slugs = content_library.filter_map { |item| item["slug"] if item.is_a?(Hash) }

raise "Navigator answers must be an array" unless answers.is_a?(Array)
raise "Navigator needs at least 10 curated answers" if answers.length < 10

required_fields = %w[id question search_query keywords answer article_title article_url checked_at]
seen_ids = {}
seen_questions = {}
excluded_prefixes = %w[/work-ops-hub/ /inventory-memo.html /skills/ /reports/]

answers.each_with_index do |item, index|
  label = "navigator_answers.yml item #{index + 1}"
  raise "#{label} must be a mapping" unless item.is_a?(Hash)

  required_fields.each do |field|
    value = item[field]
    missing = value.nil? || (value.respond_to?(:empty?) && value.empty?)
    raise "#{label} is missing #{field}" if missing
  end

  id = item["id"].to_s
  question = item["question"].to_s
  raise "Duplicate navigator id: #{id}" if seen_ids[id]
  raise "Duplicate navigator question: #{question}" if seen_questions[question]
  seen_ids[id] = true
  seen_questions[question] = true

  keywords = item["keywords"]
  raise "#{label} keywords must be a non-empty array" unless keywords.is_a?(Array) && keywords.any?

  checked_at = item["checked_at"].to_s
  raise "#{label} checked_at must use YYYY-MM-DD" unless checked_at.match?(/\A\d{4}-\d{2}-\d{2}\z/)

  article_url = item["article_url"].to_s
  raise "#{label} article_url must be root-relative" unless article_url.start_with?("/")
  if excluded_prefixes.any? { |prefix| article_url.start_with?(prefix) }
    raise "#{label} points to an excluded path: #{article_url}"
  end

  relative_path = article_url.sub(%r{\A/}, "")
  generated_path = if File.extname(relative_path).empty?
    File.join(site_dir, relative_path, "index.html")
  else
    File.join(site_dir, relative_path)
  end
  raise "Navigator article route was not generated: #{article_url}" unless File.file?(generated_path)

  content_slug = item["content_slug"]
  if content_slug && !content_slugs.include?(content_slug)
    raise "#{label} has an unknown content_slug: #{content_slug}"
  end
end

navigator_page = File.join(site_dir, "navigator", "index.html")
raise "Navigator page was not generated" unless File.file?(navigator_page)

generated_html = File.read(navigator_page, encoding: "UTF-8")
raise "Navigator answer data was not embedded" unless generated_html.include?("navigator-answers")
raise "Content library data was not embedded" unless generated_html.include?("navigator-library")
raise "Navigator page is missing its Pagefind exclusion" unless generated_html.include?("data-pagefind-ignore")

puts "Verified #{answers.length} navigator answers and generated routes."
