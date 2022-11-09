package org.example.configuration.captcha;

import com.fasterxml.jackson.annotation.*;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({ "success", "score", "action","challenge_ts", "hostname", "error-codes" })
public class GoogleResponse {
    @JsonProperty("success")
    private boolean success;
    @JsonProperty("challenge_ts")
    private String challengeTs;
    @JsonProperty("hostname")
    private String hostname;
    @JsonProperty("score")
    private float score;
    @JsonProperty("action")
    private String action;
}