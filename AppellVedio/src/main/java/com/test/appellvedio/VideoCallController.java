package com.test.appellvedio;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
public class VideoCallController {



//    @GetMapping("/video-call")
//    public String showVideoCallPage(@RequestParam("username") String username)
//    {
//        return "videocall";
//    }

//    @GetMapping("/video-call")
//    public String showVideoCallPage(@RequestParam("username") String username, Model model) {
//        // Generate or retrieve the roomID
//        String roomID = String.valueOf((int) (Math.random() * 10000)); // For example, generate a random roomID
//
//        // Add attributes to the model
//        model.addAttribute("username", username);
//        model.addAttribute("roomID", roomID);
//
//        return "videocall";
//    }
@GetMapping("/video-call")
public String showVideoCallPage(@RequestParam("username") String username,
                                @RequestParam(value = "roomID", required = false) String roomID,
                                Model model) {
    // Generate or retrieve the roomID if not provided
    if (roomID == null || roomID.isEmpty()) {
        roomID = String.valueOf((int) (Math.random() * 10000)); // For example, generate a random roomID
    }

    // Add attributes to the model
    model.addAttribute("username", username);
    model.addAttribute("roomID", roomID);

    return "videocall";
}







    @GetMapping("/create-meet")
    public String createMeet(@RequestParam("username") String username,
                             @RequestParam("meetingDateTime") String meetingDateTime,
                             Model model) {
        LocalDateTime meetingDateTimeParsed = LocalDateTime.parse(meetingDateTime, DateTimeFormatter.ISO_DATE_TIME);
        LocalDateTime currentDateTime = LocalDateTime.now();

        // Ajouter les données à passer au modèle
        model.addAttribute("username", username);
        model.addAttribute("meetingDateTime", meetingDateTime);
        model.addAttribute("currentDateTime", currentDateTime);

        return "meet-created-successfully";
    }
    @GetMapping("/join-meetD")
    public String joinMeet(@RequestParam("username") String username,
                           @RequestParam("meetingDateTime") String meetingDateTime,
                           Model model) {
        // Cette méthode pourrait rediriger l'utilisateur vers la page de réunion
        model.addAttribute("username", username);
        model.addAttribute("meetingDateTime", meetingDateTime);
        return "redirect:/video-call?username=" + username;

    }
    @GetMapping("/join-meet")
    public String joinMeet(@RequestParam("username") String username,
                           @RequestParam("roomID") String roomID) {
        // Redirigez vers la page de l'appel vidéo avec les paramètres fournis
        return "redirect:/video-call?username=" + username + "&roomID=" + roomID;
    }



}

